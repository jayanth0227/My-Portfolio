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
  radius = 40,
  strokeDasharray = "4 2",
  className = "",
}: InteractiveHexagonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check accessibility: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
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

    // Geometry constants for horizontal (flat-top) honeycomb grid
    const sqrt3 = Math.sqrt(3);
    const colStep = (3 * radius) / 2;
    const rowStep = sqrt3 * radius;

    const initTiles = () => {
      tiles = [];
      const cols = Math.ceil(width / colStep) + 3;
      const rows = Math.ceil(height / rowStep) + 3;

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
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Track cursor while inside hero section
      if (
        clientX >= -60 &&
        clientX <= rect.width + 60 &&
        clientY >= -60 &&
        clientY <= rect.height + 60
      ) {
        mouse.isInside = true;
        mouse.targetX = clientX;
        mouse.targetY = clientY;

        // Snap smoothly on initial entry
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

    // Flat-top hexagon vertex calculation helper
    const drawHexagon = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
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

    // Subdued, subtle physics parameters:
    // Keeps distance between hexagons small, controlled, and organic
    const interactionRadius = 175; // Zone of yellow neon illumination
    const maxDisplacement = 5.0; // Strictly small bounded displacement
    const springSpeed = 0.12;
    const damping = 0.82;

    const render = (now: number) => {
      // Damp mouse cursor velocity
      mouse.velX *= 0.84;
      mouse.velY *= 0.84;

      // Instant direct cursor tracking (no artificial lag or smoothing delay)
      if (mouse.isInside && mouse.targetX > -1000) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Yellow Neon Spotlight Glow around cursor position
      if (mouse.isInside && mouse.x > -500 && mouse.y > -500) {
        const glowRadius = 240;
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        // Multi-stage neon yellow spotlight
        glowGrad.addColorStop(0, "rgba(254, 240, 138, 0.48)"); // Intense bright warm yellow core
        glowGrad.addColorStop(0.25, "rgba(250, 204, 21, 0.28)"); // Vibrant electric neon yellow
        glowGrad.addColorStop(0.55, "rgba(234, 179, 8, 0.12)"); // Amber golden fringe
        glowGrad.addColorStop(1, "rgba(234, 179, 8, 0)"); // Smooth fade to white

        ctx.save();
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Setup dashed lines
      if (dashPattern.length > 0) {
        ctx.setLineDash(dashPattern);
      }

      const timeSec = now * 0.001;
      const activeTiles: HexagonTile[] = [];

      // 2. Base tiles pass: neutral gray dashed lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(212, 212, 216, 0.95)";
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];

        if (!prefersReducedMotion) {
          // Subtle organic ambient breathing
          const ambientX = Math.sin(timeSec * 0.7 + tile.phase) * 0.4;
          const ambientY = Math.cos(timeSec * 0.5 + tile.phase) * 0.4;

          // Bounded magnetic displacement
          let targetOffsetX = 0;
          let targetOffsetY = 0;
          let targetActivation = 0;

          if (mouse.x > -1000 && mouse.y > -1000) {
            const dx = tile.originX - mouse.x;
            const dy = tile.originY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < interactionRadius && dist > 0.1) {
              const norm = dist / interactionRadius;
              const falloff = (1 - norm) * (1 - norm);

              // Little amount of distance capped to maxDisplacement
              const shift = falloff * maxDisplacement;
              const dirX = dx / dist;
              const dirY = dy / dist;

              targetOffsetX = dirX * shift + mouse.velX * 0.04 * falloff;
              targetOffsetY = dirY * shift + mouse.velY * 0.04 * falloff;

              const totalShift = Math.sqrt(
                targetOffsetX * targetOffsetX + targetOffsetY * targetOffsetY
              );
              if (totalShift > maxDisplacement) {
                targetOffsetX = (targetOffsetX / totalShift) * maxDisplacement;
                targetOffsetY = (targetOffsetY / totalShift) * maxDisplacement;
              }

              targetActivation = falloff;
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

          tile.activation += (targetActivation - tile.activation) * 0.18;
        }

        if (tile.activation > 0.02) {
          activeTiles.push(tile);
        } else {
          drawHexagon(tile.x, tile.y, radius);
          ctx.stroke();
        }
      }

      // 3. Hovered tiles pass: yellow neon light effect with glow & translucent fill
      for (let i = 0; i < activeTiles.length; i++) {
        const tile = activeTiles[i];
        const act = tile.activation;

        ctx.save();
        // Neon yellow glow drop-shadow
        ctx.shadowColor = "rgba(234, 179, 8, 0.95)";
        ctx.shadowBlur = Math.round(act * 16);
        ctx.lineWidth = 1 + act * 0.8;

        // Transition stroke smoothly to vibrant neon yellow/gold
        const r = Math.round(212 + (234 - 212) * act);
        const g = Math.round(212 + (179 - 212) * act);
        const b = Math.round(216 + (8 - 216) * act);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;

        // Translucent neon yellow backlight inside each hovered hexagon cell
        ctx.fillStyle = `rgba(254, 240, 138, ${act * 0.32})`;

        drawHexagon(tile.x, tile.y, radius);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render(0);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
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
