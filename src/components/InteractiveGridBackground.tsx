"use client";

import React, { useEffect, useRef } from "react";

interface GridNode {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  activation: number;
  phase: number;
}

export interface InteractiveGridBackgroundProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
  maxDisplacement?: number;
  interactionRadius?: number;
  className?: string;
  squares?: Array<[col: number, row: number]>;
}

const LIGHT = {
  stroke: "rgba(212, 212, 216, 0.85)",
  glow1: "rgba(254, 240, 138, 0.4)",
  glow2: "rgba(250, 204, 21, 0.2)",
  glow3: "rgba(234, 179, 8, 0.06)",
  glow4: "rgba(234, 179, 8, 0)",
  cellStrokeOuter: (a: number) => `rgba(234, 179, 8, ${a * 0.45})`,
  cellStrokeInner: (a: number) => `rgba(234, 179, 8, ${Math.min(1, a * 1.1)})`,
  cellFill: (a: number) => `rgba(254, 240, 138, ${a * 0.35})`,
  particle: (a: number) => `rgba(234, 179, 8, ${0.4 + a * 0.6})`,
};

const DARK = {
  stroke: "rgba(63, 63, 70, 0.6)",
  glow1: "rgba(250, 204, 21, 0.3)",
  glow2: "rgba(234, 179, 8, 0.15)",
  glow3: "rgba(202, 138, 4, 0.04)",
  glow4: "rgba(202, 138, 4, 0)",
  cellStrokeOuter: (a: number) => `rgba(250, 204, 21, ${a * 0.4})`,
  cellStrokeInner: (a: number) => `rgba(250, 204, 21, ${Math.min(1, a * 0.9)})`,
  cellFill: (a: number) => `rgba(234, 179, 8, ${a * 0.18})`,
  particle: (a: number) => `rgba(250, 204, 21, ${0.35 + a * 0.55})`,
};

function getColors() {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) return DARK;
  return LIGHT;
}

export default function InteractiveGridBackground({
  width: cellWidth = 44,
  height: cellHeight = 44,
  x: offsetX = -1,
  y: offsetY = -1,
  strokeDasharray = "4 2",
  maxDisplacement = 4.5,
  interactionRadius = 180,
  className = "",
  squares,
}: InteractiveGridBackgroundProps) {
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
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const dashPattern = strokeDasharray.split(/[\s,]+/).map((n) => parseFloat(n)).filter((n) => !isNaN(n));

    const mouse = {
      x: -9999, y: -9999, targetX: -9999, targetY: -9999,
      velX: 0, velY: 0, prevX: -9999, prevY: -9999, isInside: false,
    };

    let cols = 0;
    let rows = 0;
    let grid: GridNode[][] = [];

    const initGrid = () => {
      cols = Math.ceil(canvasW / cellWidth) + 2;
      rows = Math.ceil(canvasH / cellHeight) + 2;
      grid = [];
      for (let c = 0; c < cols; c++) {
        grid[c] = [];
        for (let r = 0; r < rows; r++) {
          const oX = (c - 1) * cellWidth + offsetX;
          const oY = (r - 1) * cellHeight + offsetY;
          grid[c][r] = { originX: oX, originY: oY, x: oX, y: oY, vx: 0, vy: 0, activation: 0, phase: (c * 17 + r * 29) % (Math.PI * 2) };
        }
      }
    };

    let rect = canvas.getBoundingClientRect();
    const updateRect = () => { if (canvas) rect = canvas.getBoundingClientRect(); };

    let isAnimating = false;
    const requestRender = () => {
      if (!isAnimating && !prefersReducedMotion && isVisible) {
        isAnimating = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const springSpeed = 0.15;
    const damping = 0.78;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      if (cx >= -60 && cx <= rect.width + 60 && cy >= -60 && cy <= rect.height + 60) {
        mouse.isInside = true; mouse.targetX = cx; mouse.targetY = cy;
        if (mouse.x < -1000) { mouse.x = cx; mouse.y = cy; }
        if (mouse.prevX !== -9999) {
          mouse.velX = mouse.velX * 0.3 + (cx - mouse.prevX) * 0.7;
          mouse.velY = mouse.velY * 0.3 + (cy - mouse.prevY) * 0.7;
        }
        mouse.prevX = cx; mouse.prevY = cy;
        requestRender();
      } else { mouse.isInside = false; mouse.targetX = -9999; mouse.targetY = -9999; }
    };

    const handleMouseLeave = () => {
      mouse.isInside = false; mouse.targetX = -9999; mouse.targetY = -9999; mouse.prevX = -9999; mouse.prevY = -9999;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvasW = canvas.parentElement?.clientWidth || window.innerWidth;
      canvasH = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(canvasW * dpr);
      canvas.height = Math.floor(canvasH * dpr);
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.scale(dpr, dpr);
      initGrid(); updateRect();
      render(performance.now());
    };

    function render(_now: number) {
      if (!ctx) return;
      mouse.velX *= 0.8; mouse.velY *= 0.8;
      if (mouse.isInside && mouse.targetX > -1000) { mouse.x = mouse.targetX; mouse.y = mouse.targetY; }
      else { mouse.x = -9999; mouse.y = -9999; }

      ctx.clearRect(0, 0, canvasW, canvasH);

      // Spotlight glow
      if (mouse.isInside && mouse.x > -500 && mouse.y > -500) {
        const gr = 200;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, gr);
        g.addColorStop(0, colors.glow1);
        g.addColorStop(0.3, colors.glow2);
        g.addColorStop(0.6, colors.glow3);
        g.addColorStop(1, colors.glow4);
        ctx.save(); ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, gr, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }

      let maxActivity = Math.abs(mouse.velX) + Math.abs(mouse.velY);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const node = grid[c][r];
          if (!prefersReducedMotion) {
            let toX = 0, toY = 0, tA = 0;
            if (mouse.x > -1000 && mouse.y > -1000) {
              const dx = node.originX - mouse.x, dy = node.originY - mouse.y;
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
            const dX = node.originX + toX, dY = node.originY + toY;
            node.vx = (node.vx + (dX - node.x) * springSpeed) * damping;
            node.vy = (node.vy + (dY - node.y) * springSpeed) * damping;
            node.x += node.vx; node.y += node.vy;
            node.activation += (tA - node.activation) * 0.25;
            const m = Math.abs(node.vx) + Math.abs(node.vy) + Math.abs(node.x - node.originX) + Math.abs(node.y - node.originY) + node.activation;
            if (m > maxActivity) maxActivity = m;
          }
        }
      }

      // Active cells
      const sqSet = new Set<string>();
      if (squares) for (const [sc, sr] of squares) sqSet.add(`${sc},${sr}`);

      for (let c = 0; c < cols - 1; c++) {
        for (let r = 0; r < rows - 1; r++) {
          const n00 = grid[c][r], n10 = grid[c + 1][r], n11 = grid[c + 1][r + 1], n01 = grid[c][r + 1];
          const isSq = sqSet.has(`${c},${r}`);
          const avg = (n00.activation + n10.activation + n11.activation + n01.activation) / 4;
          if (avg > 0.02 || isSq) {
            const act = isSq ? Math.max(avg, 0.45) : avg;
            ctx.save();
            ctx.lineWidth = 2.2; ctx.strokeStyle = colors.cellStrokeOuter(act);
            ctx.beginPath(); ctx.moveTo(n00.x, n00.y); ctx.lineTo(n10.x, n10.y); ctx.lineTo(n11.x, n11.y); ctx.lineTo(n01.x, n01.y); ctx.closePath(); ctx.stroke();
            ctx.lineWidth = 1 + act * 0.4;
            ctx.fillStyle = colors.cellFill(act); ctx.strokeStyle = colors.cellStrokeInner(act);
            ctx.fill(); ctx.stroke(); ctx.restore();
          }
        }
      }

      // Grid lines
      ctx.save();
      if (dashPattern.length > 0) ctx.setLineDash(dashPattern);
      ctx.lineWidth = 1; ctx.strokeStyle = colors.stroke;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols - 1; c++) { const f = grid[c][r], t = grid[c + 1][r]; ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y); }
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows - 1; r++) { const f = grid[c][r], t = grid[c][r + 1]; ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y); }
      ctx.stroke(); ctx.restore();

      // Particles
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const node = grid[c][r];
          if (node.activation > 0.03) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1.4 + node.activation * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = colors.particle(node.activation);
            ctx.fill();
          }
        }
      }

      if (!prefersReducedMotion && isVisible && (maxActivity > 0.005 || mouse.isInside)) {
        animationFrameId = requestAnimationFrame(render);
      } else { isAnimating = false; animationFrameId = 0; }
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !prefersReducedMotion) { updateRect(); requestRender(); }
      else if (!isVisible && animationFrameId) { cancelAnimationFrame(animationFrameId); isAnimating = false; animationFrameId = 0; }
    }, { threshold: 0.05 });

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    observer.observe(canvas);

    return () => {
      themeObserver.disconnect(); observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [cellWidth, cellHeight, offsetX, offsetY, strokeDasharray, maxDisplacement, interactionRadius, squares]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
