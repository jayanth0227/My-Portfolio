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
  stroke: "rgba(212, 212, 216, 0.75)",
  glow1: "rgba(254, 240, 138, 0.45)",
  glow2: "rgba(250, 204, 21, 0.22)",
  glow3: "rgba(234, 179, 8, 0.08)",
  glow4: "rgba(234, 179, 8, 0)",
  stripeActiveOuter: (a: number) => `rgba(234, 179, 8, ${a * 0.55})`,
  stripeActiveInner: (a: number) => `rgba(234, 179, 8, ${Math.min(1, a * 1.1)})`,
  particle: (a: number) => `rgba(234, 179, 8, ${0.4 + a * 0.6})`,
};

const DARK = {
  stroke: "rgba(63, 63, 70, 0.55)",
  glow1: "rgba(250, 204, 21, 0.35)",
  glow2: "rgba(234, 179, 8, 0.18)",
  glow3: "rgba(202, 138, 4, 0.05)",
  glow4: "rgba(202, 138, 4, 0)",
  stripeActiveOuter: (a: number) => `rgba(250, 204, 21, ${a * 0.5})`,
  stripeActiveInner: (a: number) => `rgba(250, 204, 21, ${Math.min(1, a * 0.95)})`,
  particle: (a: number) => `rgba(250, 204, 21, ${0.4 + a * 0.55})`,
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

    // Initialize diagonal stripes
    const initStripes = () => {
      stripes = [];
      const step = 20; // Distance between nodes along a line
      const minK = -canvasH;
      const maxK = canvasW + canvasH;

      for (let k = minK; k <= maxK; k += spacing) {
        const nodes: StripeNode[] = [];
        // Diagonal line equation: y = x - k => x varies from 0 to canvasW + canvasH
        for (let x = 0; x <= canvasW + 100; x += step) {
          const y = x - k;
          if (y >= -50 && y <= canvasH + 50) {
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
        }
        if (nodes.length > 1) {
          stripes.push({ nodes, k });
        }
      }

      // Initialize floating motion particles
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * (canvasW || 800),
          y: Math.random() * (canvasH || 600),
          vx: (Math.random() - 0.5) * 0.35 + 0.2,
          vy: (Math.random() - 0.5) * 0.35 + 0.2,
          size: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.7 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.03 + 0.015,
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
    const damping = 0.76;

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

    function render(now: number) {
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

      // 1. Ambient Mouse Spotlight Glow
      if (mouse.isInside && mouse.x > -500 && mouse.y > -500) {
        const gr = 240;
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

      // 2. Update Striped Nodes with Spring Physics
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

      // 3. Render Base Striped Lines
      ctx.save();
      if (dashPattern.length > 0) ctx.setLineDash(dashPattern);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.stroke;
      ctx.beginPath();
      for (let s = 0; s < stripes.length; s++) {
        const line = stripes[s];
        if (line.nodes.length < 2) continue;
        ctx.moveTo(line.nodes[0].x, line.nodes[0].y);
        for (let i = 1; i < line.nodes.length; i++) {
          ctx.lineTo(line.nodes[i].x, line.nodes[i].y);
        }
      }
      ctx.stroke();
      ctx.restore();

      // 4. Render Glowing Active Stripe Highlights
      for (let s = 0; s < stripes.length; s++) {
        const line = stripes[s];
        let maxLineAct = 0;
        for (let i = 0; i < line.nodes.length; i++) {
          if (line.nodes[i].activation > maxLineAct) maxLineAct = line.nodes[i].activation;
        }

        if (maxLineAct > 0.03) {
          ctx.save();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = colors.stripeActiveOuter(maxLineAct);
          ctx.beginPath();
          ctx.moveTo(line.nodes[0].x, line.nodes[0].y);
          for (let i = 1; i < line.nodes.length; i++) {
            ctx.lineTo(line.nodes[i].x, line.nodes[i].y);
          }
          ctx.stroke();

          ctx.lineWidth = 1.2;
          ctx.strokeStyle = colors.stripeActiveInner(maxLineAct);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 5. Render Floating Motion Particles
      for (let p = 0; p < particles.length; p++) {
        const pt = particles[p];
        pt.phase += pt.speed;
        pt.x += pt.vx;
        pt.y += pt.vy;

        // Wrap around borders
        if (pt.x < 0) pt.x = canvasW;
        if (pt.x > canvasW) pt.x = 0;
        if (pt.y < 0) pt.y = canvasH;
        if (pt.y > canvasH) pt.y = 0;

        // Particle pulse
        const pulse = (Math.sin(pt.phase) + 1) * 0.5;
        const currentAlpha = pt.alpha * (0.4 + 0.6 * pulse);

        // Distance from mouse to accelerate/glow
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

        // Soft glow on larger particles
        if (pt.size > 2 || mouseBoost > 0.2) {
          ctx.fillStyle = colors.glow1;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (pt.size + mouseBoost * 2) * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Keep animation alive if particles or spring physics are active
      if (maxActivity > 0.005 || particles.length > 0) {
        if (isVisible && !prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(render);
        } else {
          isAnimating = false;
        }
      } else {
        isAnimating = false;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) requestRender();
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
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
