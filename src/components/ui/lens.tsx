"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Position {
  /** The x coordinate of the lens */
  x: number;
  /** The y coordinate of the lens */
  y: number;
}

export interface LensProps {
  /** The children of the lens */
  children: React.ReactNode;
  /** The zoom factor of the lens */
  zoomFactor?: number;
  /** The size of the lens in pixels */
  lensSize?: number;
  /** The position of the lens */
  position?: Position;
  /** The default position of the lens */
  defaultPosition?: Position;
  /** Whether the lens is static */
  isStatic?: boolean;
  /** The duration of the animation */
  duration?: number;
  /** The color of the lens mask */
  lensColor?: string;
  /** The aria label of the lens */
  ariaLabel?: string;
  /** Optional custom class name */
  className?: string;
  /** Background color for the magnified lens content (defaults to transparent) */
  lensBackground?: string;
  /** Whether to render a subtle lens glass rim outline */
  showRim?: boolean;
}

export function Lens({
  children,
  zoomFactor = 1.35,
  lensSize = 170,
  isStatic = false,
  position = { x: 0, y: 0 },
  defaultPosition,
  duration = 0.15,
  lensColor = "black",
  ariaLabel = "Zoom Area",
  className = "",
  lensBackground = "bg-transparent",
  showRim = true,
}: LensProps) {
  if (zoomFactor < 1) {
    throw new Error("zoomFactor must be greater than 1");
  }
  if (lensSize < 0) {
    throw new Error("lensSize must be greater than 0");
  }

  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState<Position>(position);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPosition = useMemo(() => {
    if (isStatic) return position;
    if (defaultPosition && !isHovering) return defaultPosition;
    return mousePosition;
  }, [isStatic, position, defaultPosition, isHovering, mousePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsHovering(false);
  }, []);

  const radius = lensSize / 2;
  // Safety margin so the circular mask is never clipped by element boundaries
  const pad = Math.ceil(lensSize);

  // Mask on the unmagnified text: transparent under the lens, black everywhere else
  const unmagnifiedMask = isHovering || isStatic || defaultPosition
    ? `radial-gradient(circle ${radius}px at ${currentPosition.x}px ${currentPosition.y}px, transparent ${radius}px, black ${radius + 0.5}px)`
    : undefined;

  // Mask on the magnified text: black under the lens, transparent everywhere else
  const magnifiedMaskX = currentPosition.x + pad;
  const magnifiedMaskY = currentPosition.y + pad;
  const magnifiedMask = `radial-gradient(circle ${radius}px at ${magnifiedMaskX}px ${magnifiedMaskY}px, ${lensColor} ${radius}px, transparent ${radius + 0.5}px)`;

  const LensContent = useMemo(() => {
    const { x, y } = currentPosition;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration }}
        className={cn(
          "pointer-events-none select-none overflow-visible",
          lensBackground
        )}
        style={{
          position: "absolute",
          left: -pad,
          top: -pad,
          width: `calc(100% + ${pad * 2}px)`,
          height: `calc(100% + ${pad * 2}px)`,
          maskImage: magnifiedMask,
          WebkitMaskImage: magnifiedMask,
          zIndex: 50,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: pad,
            top: pad,
            width: `calc(100% - ${pad * 2}px)`,
            height: `calc(100% - ${pad * 2}px)`,
            transform: `scale(${zoomFactor})`,
            transformOrigin: `${x}px ${y}px`,
          }}
        >
          {children}
        </div>
      </motion.div>
    );
  }, [
    currentPosition,
    pad,
    magnifiedMask,
    zoomFactor,
    children,
    duration,
    lensBackground,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative z-20 overflow-visible", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {/* 1. Unmagnified text layer (masked out under the lens to avoid ghosting) */}
      <div
        style={{
          maskImage: unmagnifiedMask,
          WebkitMaskImage: unmagnifiedMask,
        }}
      >
        {children}
      </div>

      {/* 2. Magnified text layer & lens rim */}
      {isStatic || defaultPosition ? (
        <>
          {LensContent}
          {showRim && (
            <div
              className="pointer-events-none absolute rounded-full border border-neutral-300/80 shadow-md ring-1 ring-black/5"
              style={{
                width: `${lensSize}px`,
                height: `${lensSize}px`,
                left: `${currentPosition.x - radius}px`,
                top: `${currentPosition.y - radius}px`,
                zIndex: 60,
              }}
            />
          )}
        </>
      ) : (
        <AnimatePresence mode="popLayout">
          {isHovering && (
            <>
              {LensContent}
              {showRim && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration }}
                  className="pointer-events-none absolute rounded-full border border-neutral-300/80 shadow-md ring-1 ring-black/5"
                  style={{
                    width: `${lensSize}px`,
                    height: `${lensSize}px`,
                    left: `${currentPosition.x - radius}px`,
                    top: `${currentPosition.y - radius}px`,
                    zIndex: 60,
                  }}
                />
              )}
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
