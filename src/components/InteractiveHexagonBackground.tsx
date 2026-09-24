"use client";

import React, { useEffect, useRef } from "react";

interface HexagonTile {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  activation: number;
  phase: number;
}

interface InteractiveHexagonBackgroundProps {
  radius?: number;
  strokeDasharray?: string;
  className?: string;
}

// Theme color sets
const LIGHT_COLORS = {
  stroke: "rgba(212, 212, 216, 0.9)",
  glow1: "rgba(254, 240, 138, 0.4)",
  glow2: "rgba(250, 204, 21, 0.2)",
  glow3: "rgba(234, 179, 8, 0.06)",
  glow4: "rgba(234, 179, 8, 0)",
  activeStrokeOuter: (a: number) => `rgba(234, 179, 8, ${a * 0.5})`,
  activeStrokeInner: (a: number) => `rgba(234, 179, 8, ${a * 0.95})`,
  activeFill: (a: number) => `rgba(254, 240, 138, ${a * 0.35})`,
};

const DARK_COLORS = {
  stroke: "rgba(63, 63, 70, 0.7)",
  glow1: "rgba(250, 204, 21, 0.3)",
  glow2: "rgba(234, 179, 8, 0.15)",
  glow3: "rgba(202, 138, 4, 0.04)",
  glow4: "rgba(202, 138, 4, 0)",
  activeStrokeOuter: (a: number) => `rgba(250, 204, 21, ${a * 0.45})`,
  activeStrokeInner: (a: number) => `rgba(250, 204, 21, ${a * 0.9})`,
  activeFill: (a: number) => `rgba(234, 179, 8, ${a * 0.2})`,
};

function getThemeColors() {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return DARK_COLORS;
  }
  return LIGHT_COLORS;
}

export default function InteractiveHexagonBackground({
  radius = 42,
  strokeDasharray = "4 2",
  className = "",
}: InteractiveHexagonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let colors = getThemeColors();

    // Watch for theme changes
    const themeObserver = new MutationObserver(() => {
      colors = getThemeColors();
      if (!isAnimating) {
        requestRender();
      }
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
      x: -9999, y: -9999,
      targetX: -9999, targetY: -9999,
      velX: 0, velY: 0,
      prevX: -9999, prevY: -9999,
      isInside: false,
    };

    let tiles: HexagonTile[] = [];
    const sqrt3 = Math.sqrt(3);
    const colStep = (3 * radius) / 2;
    const rowStep = sqrt3 * radius;

    const initTiles = () => {
      tiles = [];
      const cols = Math.ceil(width / colStep) + 2;
      const rows = Math.ceil(height / rowStep) + 2;
      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const cx = col * colStep;
          const cy = row * rowStep + (col % 2 !== 0 ? rowStep / 2 : 0);
          tiles.push({
            originX: cx, originY: cy, x: cx, y: cy,
            vx: 0, vy: 0, activation: 0,
            phase: (col * 19 + row * 31) % (Math.PI * 2),
          });
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

    const interactionRadius = 160;
    const maxDisplacement = 2.5;
    const springSpeed = 0.15;
    const damping = 0.78;

    const traceHexagon = (cx: number, cy: number, r: number) => {
      if (!ctx) return;
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 * Math.PI) / 180;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      if (clientX >= -60 && clientX <= rect.width + 60 && clientY >= -60 && clientY <= rect.height + 60) {
        mouse.isInside = true;
        mouse.targetX = clientX;
        mouse.targetY = clientY;
        if (mouse.x < -1000) { mouse.x = clientX; mouse.y = clientY; }
        if (mouse.prevX !== -9999) {
          mouse.velX = mouse.velX * 0.3 + (clientX - mouse.prevX) * 0.7;
          mouse.velY = mouse.velY * 0.3 + (clientY - mouse.prevY) * 0.7;
        }
        mouse.prevX = clientX; mouse.prevY = clientY;
        requestRender();
      } else {
        mouse.isInside = false; mouse.targetX = -9999; mouse.targetY = -9999;
      }
    };

    const handleMouseLeave = () => {
      mouse.isInside = false;
      mouse.targetX = -9999; mouse.targetY = -9999;
      mouse.prevX = -9999; mouse.prevY = -9999;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initTiles();
      updateRect();
      render(performance.now());
    };

    function render(_now: number) {
      if (!ctx) return;
      mouse.velX *= 0.8;
      mouse.velY *= 0.8;

      if (mouse.isInside && mouse.targetX > -1000) {
        mouse.x = mouse.targetX; mouse.y = mouse.targetY;
      } else {
        mouse.x = -9999; mouse.y = -9999;
      }

      ctx.clearRect(0, 0, width, height);

      // Warm Spotlight around cursor
      if (mouse.isInside && mouse.x > -500 && mouse.y > -500) {
        const glowRadius = 200;
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
        glowGrad.addColorStop(0, colors.glow1);
        glowGrad.addColorStop(0.3, colors.glow2);
        glowGrad.addColorStop(0.6, colors.glow3);
        glowGrad.addColorStop(1, colors.glow4);
        ctx.save();
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const activeTiles: HexagonTile[] = [];
      let maxActivity = Math.abs(mouse.velX) + Math.abs(mouse.velY);

      ctx.save();
      if (dashPattern.length > 0) ctx.setLineDash(dashPattern);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.stroke;
      ctx.beginPath();

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        if (!prefersReducedMotion) {
          let targetOffsetX = 0, targetOffsetY = 0, targetActivation = 0;
          if (mouse.x > -1000 && mouse.y > -1000) {
            const dx = tile.originX - mouse.x;
            const dy = tile.originY - mouse.y;
            if (Math.abs(dx) < interactionRadius && Math.abs(dy) < interactionRadius) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < interactionRadius && dist > 0.1) {
                const norm = dist / interactionRadius;
                const falloff = (1 - norm) * (1 - norm);
                const shift = falloff * maxDisplacement;
                const dirX = dx / dist, dirY = dy / dist;
                targetOffsetX = dirX * shift + mouse.velX * 0.02 * falloff;
                targetOffsetY = dirY * shift + mouse.velY * 0.02 * falloff;
                targetActivation = falloff;
              }
            }
          }
          const destX = tile.originX + targetOffsetX;
          const destY = tile.originY + targetOffsetY;
          tile.vx = (tile.vx + (destX - tile.x) * springSpeed) * damping;
          tile.vy = (tile.vy + (destY - tile.y) * springSpeed) * damping;
          tile.x += tile.vx; tile.y += tile.vy;
          tile.activation += (targetActivation - tile.activation) * 0.25;
          const tileMotion = Math.abs(tile.vx) + Math.abs(tile.vy) + Math.abs(tile.x - tile.originX) + Math.abs(tile.y - tile.originY) + tile.activation;
          if (tileMotion > maxActivity) maxActivity = tileMotion;
        }
        if (tile.activation > 0.02) activeTiles.push(tile);
        else traceHexagon(tile.x, tile.y, radius);
      }
      ctx.stroke();
      ctx.restore();

      // Active highlighted tiles
      for (let i = 0; i < activeTiles.length; i++) {
        const tile = activeTiles[i];
        const act = tile.activation;
        ctx.save();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = colors.activeStrokeOuter(act);
        ctx.beginPath();
        traceHexagon(tile.x, tile.y, radius);
        ctx.stroke();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = colors.activeStrokeInner(act);
        ctx.fillStyle = colors.activeFill(act);
        ctx.beginPath();
        traceHexagon(tile.x, tile.y, radius);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      if (!prefersReducedMotion && isVisible && (maxActivity > 0.005 || mouse.isInside)) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isAnimating = false;
        animationFrameId = 0;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !prefersReducedMotion) { updateRect(); requestRender(); }
        else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          isAnimating = false; animationFrameId = 0;
        }
      },
      { threshold: 0.05 }
    );
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    observer.observe(canvas);

    return () => {
      themeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [radius, strokeDasharray]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
