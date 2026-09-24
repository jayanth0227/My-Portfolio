"use client";

import React, { useEffect, useRef } from "react";

interface HexagonTile {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  activation: number; // 0 to 1
  phase: number;
}

interface InteractiveHexagonBackgroundProps {
  radius?: number;
  strokeDasharray?: string;
  className?: string;
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

    // Parse stroke dash array
    const dashPattern = strokeDasharray
      .split(/[\s,]+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));

    // Mouse state
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

    let tiles: HexagonTile[] = [];

    // Geometry constants for horizontal honeycomb grid
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
            originX: cx,
            originY: cy,
            x: cx,
            y: cy,
            vx: 0,
            vy: 0,
            activation: 0,
            phase: (col * 19 + row * 31) % (Math.PI * 2),
          });
        }
      }
    };

    // Cache canvas client rect to eliminate forced reflows during mousemove
    let rect = canvas.getBoundingClientRect();
    const updateRect = () => {
      if (canvas) rect = canvas.getBoundingClientRect();
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initTiles();
      updateRect();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateRect, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (
        clientX >= -60 &&
        clientX <= rect.width + 60 &&
        clientY >= -60 &&
        clientY <= rect.height + 60
      ) {
        mouse.isInside = true;
        mouse.targetX = clientX;
        mouse.targetY = clientY;

        if (mouse.x < -1000) {
          mouse.x = clientX;
          mouse.y = clientY;
        }

        if (mouse.prevX !== -9999) {
          const dx = clientX - mouse.prevX;
          const dy = clientY - mouse.prevY;
          mouse.velX = mouse.velX * 0.4 + dx * 0.6;
          mouse.velY = mouse.velY * 0.4 + dy * 0.6;
        }

        mouse.prevX = clientX;
        mouse.prevY = clientY;
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Flat-top hexagon path generator (batched, zero individual stroke calls)
    const traceHexagon = (cx: number, cy: number, r: number) => {
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 * Math.PI) / 180;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    };

    const interactionRadius = 175;
    const maxDisplacement = 4.5;
    const springSpeed = 0.12;
    const damping = 0.82;

    const render = (now: number) => {
      mouse.velX *= 0.84;
      mouse.velY *= 0.84;

      if (mouse.isInside && mouse.targetX > -1000) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Warm Spotlight around cursor
      if (mouse.isInside && mouse.x > -500 && mouse.y > -500) {
        const glowRadius = 220;
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        glowGrad.addColorStop(0, "rgba(254, 240, 138, 0.42)");
        glowGrad.addColorStop(0.3, "rgba(250, 204, 21, 0.22)");
        glowGrad.addColorStop(0.6, "rgba(234, 179, 8, 0.08)");
        glowGrad.addColorStop(1, "rgba(234, 179, 8, 0)");

        ctx.save();
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const timeSec = now * 0.001;
      const activeTiles: HexagonTile[] = [];

      ctx.save();
      if (dashPattern.length > 0) {
        ctx.setLineDash(dashPattern);
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(212, 212, 216, 0.9)";

      // Single batched path for all inactive hexagons (huge 10x-50x GPU throughput boost)
      ctx.beginPath();

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];

        if (!prefersReducedMotion) {
          const ambientX = Math.sin(timeSec * 0.6 + tile.phase) * 0.35;
          const ambientY = Math.cos(timeSec * 0.4 + tile.phase) * 0.35;

          let targetOffsetX = 0;
          let targetOffsetY = 0;
          let targetActivation = 0;

          if (mouse.x > -1000 && mouse.y > -1000) {
            const dx = tile.originX - mouse.x;
            const dy = tile.originY - mouse.y;

            // Fast bounding box check before calculating square roots
            if (Math.abs(dx) < interactionRadius && Math.abs(dy) < interactionRadius) {
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < interactionRadius && dist > 0.1) {
                const norm = dist / interactionRadius;
                const falloff = (1 - norm) * (1 - norm);
                const shift = falloff * maxDisplacement;

                const dirX = dx / dist;
                const dirY = dy / dist;

                targetOffsetX = dirX * shift + mouse.velX * 0.03 * falloff;
                targetOffsetY = dirY * shift + mouse.velY * 0.03 * falloff;

                targetActivation = falloff;
              }
            }
          }

          const destX = tile.originX + ambientX + targetOffsetX;
          const destY = tile.originY + ambientY + targetOffsetY;

          const springForceX = (destX - tile.x) * springSpeed;
          const springForceY = (destY - tile.y) * springSpeed;

          tile.vx = (tile.vx + springForceX) * damping;
          tile.vy = (tile.vy + springForceY) * damping;

          tile.x += tile.vx;
          tile.y += tile.vy;

          tile.activation += (targetActivation - tile.activation) * 0.2;
        }

        if (tile.activation > 0.03) {
          activeTiles.push(tile);
        } else {
          traceHexagon(tile.x, tile.y, radius);
        }
      }

      ctx.stroke();
      ctx.restore();

      // 2. Active highlighted tiles (rendered individually only for active tiles)
      for (let i = 0; i < activeTiles.length; i++) {
        const tile = activeTiles[i];
        const act = tile.activation;

        ctx.save();
        ctx.shadowColor = "rgba(234, 179, 8, 0.85)";
        ctx.shadowBlur = Math.round(act * 12);
        ctx.lineWidth = 1 + act * 0.6;

        ctx.strokeStyle = `rgba(234, 179, 8, ${act})`;
        ctx.fillStyle = `rgba(254, 240, 138, ${act * 0.3})`;

        ctx.beginPath();
        traceHexagon(tile.x, tile.y, radius);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      if (!prefersReducedMotion && isVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !prefersReducedMotion && !animationFrameId) {
          updateRect();
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    if (prefersReducedMotion) {
      render(0);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
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
