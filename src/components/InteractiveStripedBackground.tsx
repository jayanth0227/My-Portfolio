"use client";

import React, { useEffect, useRef } from "react";

interface StripeNode {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  activation: number;
}

interface StripeLine {
  nodes: StripeNode[];
  k: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
}

export interface InteractiveStripedBackgroundProps {
  spacing?: number;
  strokeDasharray?: string;
  maxDisplacement?: number;
  interactionRadius?: number;
  className?: string;
  particleCount?: number;
}

const LIGHT = {
  stroke: "rgba(212, 212, 216, 0.85)",
  glow1: "rgba(254, 240, 138, 0.45)",
  glow2: "rgba(250, 204, 21, 0.22)",
  glow3: "rgba(234, 179, 8, 0.08)",
  glow4: "rgba(234, 179, 8, 0)",
  stripeActiveOuter: (a: number) => `rgba(234, 179, 8, ${Math.min(1, a * 0.6)})`,
  stripeActiveInner: (a: number) => `rgba(234, 179, 8, ${Math.min(1, a * 1.1)})`,
  particle: (a: number) => `rgba(234, 179, 8, ${Math.min(1, 0.4 + a * 0.6)})`,
};

const DARK = {
  stroke: "rgba(63, 63, 70, 0.65)",
  glow1: "rgba(250, 204, 21, 0.35)",
  glow2: "rgba(234, 179, 8, 0.18)",
  glow3: "rgba(202, 138, 4, 0.05)",
  glow4: "rgba(202, 138, 4, 0)",
  stripeActiveOuter: (a: number) => `rgba(250, 204, 21, ${Math.min(1, a * 0.55)})`,
  stripeActiveInner: (a: number) => `rgba(250, 204, 21, ${Math.min(1, a * 1.0)})`,
  particle: (a: number) => `rgba(250, 204, 21, ${Math.min(1, 0.35 + a * 0.6)})`,
};

function getColors() {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return DARK;
  }
  return LIGHT;
}

export default function InteractiveStripedBackground({
  spacing = 38,
  strokeDasharray = "4 2",
  maxDisplacement = 6,
  interactionRadius = 190,
  className = "",
  particleCount = 40,
}: InteractiveStripedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number = 0;
    let isVisible = true;
    let canvasW = 0;
    let canvasH = 0;
    let dpr = 1;
    let colors = getColors();

    const themeObserver = new MutationObserver(() => {
      colors = getColors();
      if (!isAnimating) requestRender();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const dashPattern = strokeDasharray
      .split(/[\s,]+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));

    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      velX: 0,
      velY: 0,
      prevX: -9999,
      prevY: -9999,
      isInside: false,
    };

    let stripes: StripeLine[] = [];
    let particles: Particle[] = [];

    // Initialize diagonal stripes with full bounding box coverage and smooth step nodes
    const initStripes = () => {
      stripes = [];
      const step = 28; // Distance between control nodes along diagonal line
      const pad = 60;
      const kStep = spacing * Math.SQRT2;
      const minK = -canvasH - pad;
      const maxK = canvasW + pad;

      for (let k = minK; k <= maxK; k += kStep) {
        const nodes: StripeNode[] = [];
        // Diagonal line equation: y = x - k => x = y + k
        // We want -pad <= x <= canvasW + pad AND -pad <= y <= canvasH + pad
        const xMin = Math.max(-pad, -pad + k);
        const xMax = Math.min(canvasW + pad, canvasH + pad + k);

        if (xMax > xMin) {
          for (let x = xMin; x <= xMax; x += step) {
            const y = x - k;
            nodes.push({
              originX: x,
              originY: y,
              x: x,
              y: y,
              vx: 0,
              vy: 0,
              activation: 0,
            });
          }
          const lastNode = nodes[nodes.length - 1];
          if (lastNode && xMax - lastNode.originX > 6) {
            nodes.push({
              originX: xMax,
              originY: xMax - k,
              x: xMax,
              y: xMax - k,
              vx: 0,
              vy: 0,
              activation: 0,
            });
          }
        }
        if (nodes.length > 1) {
          stripes.push({ nodes, k });
        }
      }

      // Initialize subtle floating particles
      const count = Math.min(particleCount, 25);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * (canvasW || 800),
          y: Math.random() * (canvasH || 600),
          vx: (Math.random() - 0.5) * 0.25 + 0.08,
          vy: (Math.random() - 0.5) * 0.25 + 0.08,
          size: Math.random() * 1.8 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    let rect = canvas.getBoundingClientRect();
    const updateRect = () => {
      if (canvas) rect = canvas.getBoundingClientRect();
    };

    let isAnimating = false;
    const requestRender = () => {
      if (!isAnimating && !prefersReducedMotion && isVisible) {
        isAnimating = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const springSpeed = 0.16;
    const damping = 0.78;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      if (cx >= -60 && cx <= rect.width + 60 && cy >= -60 && cy <= rect.height + 60) {
        mouse.isInside = true;
        mouse.targetX = cx;
        mouse.targetY = cy;
        if (mouse.x < -1000) {
          mouse.x = cx;
          mouse.y = cy;
        }
        if (mouse.prevX !== -9999) {
          mouse.velX = mouse.velX * 0.3 + (cx - mouse.prevX) * 0.7;
          mouse.velY = mouse.velY * 0.3 + (cy - mouse.prevY) * 0.7;
        }
        mouse.prevX = cx;
        mouse.prevY = cy;
        requestRender();
      } else {
        mouse.isInside = false;
        mouse.targetX = -9999;
        mouse.targetY = -9999;
      }
    };

    const handleMouseLeave = () => {
      mouse.isInside = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const parent = canvas.parentElement;
      canvasW = parent ? parent.clientWidth : window.innerWidth;
      canvasH = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.floor(canvasW * dpr);
      canvas.height = Math.floor(canvasH * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.scale(dpr, dpr);
      initStripes();
      updateRect();
      render(performance.now());
    };

    // Helper to trace smooth curve through nodes
    const traceStripeCurve = (nodes: StripeNode[]) => {
      if (!ctx || nodes.length < 2) return;
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < nodes.length - 1; i++) {
        const midX = (nodes[i].x + nodes[i + 1].x) / 2;
        const midY = (nodes[i].y + nodes[i + 1].y) / 2;
        ctx.quadraticCurveTo(nodes[i].x, nodes[i].y, midX, midY);
      }
      ctx.lineTo(nodes[nodes.length - 1].x, nodes[nodes.length - 1].y);
    };

    function render(_now: number) {
      if (!ctx) return;
      mouse.velX *= 0.8;
      mouse.velY *= 0.8;
      if (mouse.isInside && mouse.targetX > -1000) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }

      ctx.clearRect(0, 0, canvasW, canvasH);

      // 1. Warm Luminous Cursor Spotlight Glow (same aesthetic as Hero & About)
      if (mouse.isInside && mouse.x > -500 && mouse.y > -500) {
        const gr = 220;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, gr);
        g.addColorStop(0, colors.glow1);
        g.addColorStop(0.3, colors.glow2);
        g.addColorStop(0.65, colors.glow3);
        g.addColorStop(1, colors.glow4);
        ctx.save();
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, gr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      let maxActivity = Math.abs(mouse.velX) + Math.abs(mouse.velY);

      // 2. Update Striped Nodes with Reactive Magnetic Physics
      for (let s = 0; s < stripes.length; s++) {
        const line = stripes[s];
        for (let i = 0; i < line.nodes.length; i++) {
          const node = line.nodes[i];
          if (!prefersReducedMotion) {
            let toX = 0;
            let toY = 0;
            let tA = 0;
            if (mouse.x > -1000 && mouse.y > -1000) {
              const dx = node.originX - mouse.x;
              const dy = node.originY - mouse.y;
              if (Math.abs(dx) < interactionRadius && Math.abs(dy) < interactionRadius) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < interactionRadius && dist > 0.1) {
                  const norm = dist / interactionRadius;
                  const falloff = (1 - norm) * (1 - norm);
                  const shift = falloff * maxDisplacement;
                  toX = (dx / dist) * shift + mouse.velX * 0.02 * falloff;
                  toY = (dy / dist) * shift + mouse.velY * 0.02 * falloff;
                  tA = falloff;
                }
              }
            }
            const dX = node.originX + toX;
            const dY = node.originY + toY;
            node.vx = (node.vx + (dX - node.x) * springSpeed) * damping;
            node.vy = (node.vy + (dY - node.y) * springSpeed) * damping;
            node.x += node.vx;
            node.y += node.vy;
            node.activation += (tA - node.activation) * 0.25;
            const m =
              Math.abs(node.vx) +
              Math.abs(node.vy) +
              Math.abs(node.x - node.originX) +
              Math.abs(node.y - node.originY) +
              node.activation;
            if (m > maxActivity) maxActivity = m;
          }
        }
      }

      // 3. Render Base Dashed Striped Lines
      ctx.save();
      if (dashPattern.length > 0) ctx.setLineDash(dashPattern);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.stroke;
      ctx.beginPath();
      for (let s = 0; s < stripes.length; s++) {
        traceStripeCurve(stripes[s].nodes);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Render Active Glowing Stripe Highlights Under Cursor
      for (let s = 0; s < stripes.length; s++) {
        const line = stripes[s];
        let maxLineAct = 0;
        for (let i = 0; i < line.nodes.length; i++) {
          if (line.nodes[i].activation > maxLineAct) maxLineAct = line.nodes[i].activation;
        }

        if (maxLineAct > 0.025) {
          ctx.save();
          if (dashPattern.length > 0) ctx.setLineDash(dashPattern);

          // Outer luminous glow
          ctx.lineWidth = 2.4;
          ctx.strokeStyle = colors.stripeActiveOuter(maxLineAct);
          ctx.beginPath();
          traceStripeCurve(line.nodes);
          ctx.stroke();

          // Inner vibrant core
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = colors.stripeActiveInner(maxLineAct);
          ctx.beginPath();
          traceStripeCurve(line.nodes);
          ctx.stroke();

          ctx.restore();
        }
      }

      // 5. Render Magnetic Node Energy Sparks (matching About section particles)
      for (let s = 0; s < stripes.length; s++) {
        const line = stripes[s];
        for (let i = 0; i < line.nodes.length; i++) {
          const node = line.nodes[i];
          if (node.activation > 0.035) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1.3 + node.activation * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = colors.particle(node.activation);
            ctx.fill();
          }
        }
      }

      // 6. Render Subtle Floating Ambient Motion Particles
      for (let p = 0; p < particles.length; p++) {
        const pt = particles[p];
        pt.phase += pt.speed;
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.x < 0) pt.x = canvasW;
        if (pt.x > canvasW) pt.x = 0;
        if (pt.y < 0) pt.y = canvasH;
        if (pt.y > canvasH) pt.y = 0;

        const pulse = (Math.sin(pt.phase) + 1) * 0.5;
        const currentAlpha = pt.alpha * (0.4 + 0.6 * pulse);

        let mouseBoost = 0;
        if (mouse.x > -1000 && mouse.y > -1000) {
          const mdx = pt.x - mouse.x;
          const mdy = pt.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 160) {
            mouseBoost = (1 - mDist / 160) * 0.7;
          }
        }

        ctx.save();
        ctx.fillStyle = colors.particle(currentAlpha + mouseBoost);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size + mouseBoost * 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (pt.size > 2 || mouseBoost > 0.2) {
          ctx.fillStyle = colors.glow1;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (pt.size + mouseBoost * 2) * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Gracefully pause animation loop when idle
      if (!prefersReducedMotion && isVisible && (maxActivity > 0.005 || mouse.isInside)) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isAnimating = false;
        animationFrameId = 0;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !prefersReducedMotion) {
            updateRect();
            requestRender();
          } else if (!isVisible && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            isAnimating = false;
            animationFrameId = 0;
          }
        });
      },
      { threshold: 0.05 }
    );

    let parentResizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      parentResizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      parentResizeObserver.observe(canvas.parentElement);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    observer.observe(canvas);

    return () => {
      themeObserver.disconnect();
      observer.disconnect();
      if (parentResizeObserver) parentResizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [spacing, strokeDasharray, maxDisplacement, interactionRadius, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}

