"use client";

import React, { useEffect, useRef } from "react";

interface GridNode {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  activation: number; // 0 to 1
  phase: number;
}

export interface InteractiveGridBackgroundProps {
  /** Width of each grid square cell in pixels */
  width?: number;
  /** Height of each grid square cell in pixels */
  height?: number;
  /** Pattern origin offset X */
  x?: number;
  /** Pattern origin offset Y */
  y?: number;
  /** Dash pattern string (e.g. "4 2") */
  strokeDasharray?: string;
  /** Max spring displacement in pixels */
  maxDisplacement?: number;
  /** Radius of interactive mouse field */
  interactionRadius?: number;
  /** Additional CSS class names */
  className?: string;
  /** Optional pre-highlighted squares [col, row] */
  squares?: Array<[col: number, row: number]>;
}

export default function InteractiveGridBackground({
  width: cellWidth = 30,
  height: cellHeight = 30,
  x: offsetX = -1,
  y: offsetY = -1,
  strokeDasharray = "4 2",
  maxDisplacement = 5.5,
  interactionRadius = 185,
  className = "",
  squares,
}: InteractiveGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId: number;
    let canvasW = 0;
    let canvasH = 0;
    let dpr = 1;

    // Parse stroke dash array
    const dashPattern = strokeDasharray
      .split(/[\s,]+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));

    // Mouse tracking state
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

    let cols = 0;
    let rows = 0;
    let grid: GridNode[][] = [];

    const initGrid = () => {
      cols = Math.ceil(canvasW / cellWidth) + 3;
      rows = Math.ceil(canvasH / cellHeight) + 3;
      grid = [];

      for (let c = 0; c < cols; c++) {
        grid[c] = [];
        for (let r = 0; r < rows; r++) {
          const originX = (c - 1) * cellWidth + offsetX;
          const originY = (r - 1) * cellHeight + offsetY;

          grid[c][r] = {
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            activation: 0,
            phase: (c * 17 + r * 29) % (Math.PI * 2),
          };
        }
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasW = canvas.parentElement?.clientWidth || window.innerWidth;
      canvasH = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = canvasW * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;

      ctx.scale(dpr, dpr);
      initGrid();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
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

      ctx.clearRect(0, 0, canvasW, canvasH);

      // 1. Neon Spotlight Glow matching Hero section
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
        glowGrad.addColorStop(0, "rgba(254, 240, 138, 0.45)");
        glowGrad.addColorStop(0.25, "rgba(250, 204, 21, 0.25)");
        glowGrad.addColorStop(0.55, "rgba(234, 179, 8, 0.10)");
        glowGrad.addColorStop(1, "rgba(234, 179, 8, 0)");

        ctx.save();
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const timeSec = now * 0.001;

      // Update node physics
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const node = grid[c][r];

          if (!prefersReducedMotion) {
            const ambientX = Math.sin(timeSec * 0.7 + node.phase) * 0.4;
            const ambientY = Math.cos(timeSec * 0.5 + node.phase) * 0.4;

            let targetOffsetX = 0;
            let targetOffsetY = 0;
            let targetActivation = 0;

            if (mouse.x > -1000 && mouse.y > -1000) {
              const dx = node.originX - mouse.x;
              const dy = node.originY - mouse.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < interactionRadius && dist > 0.1) {
                const norm = dist / interactionRadius;
                const falloff = (1 - norm) * (1 - norm);
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

            const destX = node.originX + ambientX + targetOffsetX;
            const destY = node.originY + ambientY + targetOffsetY;

            const springForceX = (destX - node.x) * springSpeed;
            const springForceY = (destY - node.y) * springSpeed;

            node.vx = (node.vx + springForceX) * damping;
            node.vy = (node.vy + springForceY) * damping;

            node.x += node.vx;
            node.y += node.vy;

            node.activation += (targetActivation - node.activation) * 0.18;
          }
        }
      }

      // 2. Active Cells Pass (highlighted square tiles)
      const squaresLookup = new Set<string>();
      if (squares && squares.length > 0) {
        for (const [sqC, sqR] of squares) {
          squaresLookup.add(`${sqC},${sqR}`);
        }
      }

      for (let c = 0; c < cols - 1; c++) {
        for (let r = 0; r < rows - 1; r++) {
          const n00 = grid[c][r];
          const n10 = grid[c + 1][r];
          const n11 = grid[c + 1][r + 1];
          const n01 = grid[c][r + 1];

          const isExplicitSquare = squaresLookup.has(`${c},${r}`);
          const avgActivation =
            (n00.activation + n10.activation + n11.activation + n01.activation) /
            4;

          if (avgActivation > 0.03 || isExplicitSquare) {
            const act = isExplicitSquare ? Math.max(avgActivation, 0.45) : avgActivation;
            ctx.save();
            ctx.shadowColor = "rgba(234, 179, 8, 0.9)";
            ctx.shadowBlur = Math.round(act * 14);
            ctx.lineWidth = 1 + act * 0.8;

            ctx.fillStyle = `rgba(254, 240, 138, ${act * 0.32})`;
            ctx.strokeStyle = `rgba(234, 179, 8, ${Math.min(1, act * 1.2)})`;

            ctx.beginPath();
            ctx.moveTo(n00.x, n00.y);
            ctx.lineTo(n10.x, n10.y);
            ctx.lineTo(n11.x, n11.y);
            ctx.lineTo(n01.x, n01.y);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 3. Grid Lines Pass (dashed stroke)
      ctx.save();
      if (dashPattern.length > 0) {
        ctx.setLineDash(dashPattern);
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(212, 212, 216, 0.85)";

      ctx.beginPath();
      // Horizontal lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const from = grid[c][r];
          const to = grid[c + 1][r];
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
        }
      }
      // Vertical lines
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) {
          const from = grid[c][r];
          const to = grid[c][r + 1];
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
        }
      }
      ctx.stroke();
      ctx.restore();

      // 4. Reactive Particles at Grid Intersections
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const node = grid[c][r];
          const act = node.activation;

          ctx.beginPath();
          if (act > 0.04) {
            const pRadius = 1.4 + act * 2.2;
            ctx.arc(node.x, node.y, pRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(234, 179, 8, ${0.4 + act * 0.6})`;
            ctx.shadowColor = "rgba(234, 179, 8, 0.85)";
            ctx.shadowBlur = act * 8;
            ctx.fill();
          } else {
            ctx.arc(node.x, node.y, 1.1, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(212, 212, 216, 0.65)";
            ctx.shadowBlur = 0;
            ctx.fill();
          }
        }
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
  }, [cellWidth, cellHeight, offsetX, offsetY, strokeDasharray, maxDisplacement, interactionRadius, squares]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
