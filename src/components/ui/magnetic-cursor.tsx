"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export interface MagneticCursorProps {
  dotSize?: number;
  ringSize?: number;
  color?: string;
  glowColor?: string;
}

export function MagneticCursor({
  dotSize = 8,
  ringSize = 36,
}: MagneticCursorProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);

  // Exact pointer coords
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for outer ring
  const ringX = useSpring(mouseX, { stiffness: 450, damping: 30, mass: 0.6 });
  const ringY = useSpring(mouseY, { stiffness: 450, damping: 30, mass: 0.6 });

  // Spring scale for state morphing
  const scale = useSpring(1, { stiffness: 400, damping: 25 });

  useEffect(() => {
    // Only enable on desktop with fine pointer
    const mediaQuery = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    if (!mediaQuery.matches) return;

    setMounted(true);

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Check if target is interactive or magnetic
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'button, a, input, textarea, select, [role="button"], [data-magnetic], .cursor-pointer, .project-uiverse-card, .timeline-interactive-card'
          )
        );

        const hasMagneticAttr = Boolean(target.closest('[data-magnetic="true"]'));

        setIsHovering(isInteractive);
        setIsMagnetic(hasMagneticAttr);
      }
    };

    const handlePointerDown = () => setIsClicking(true);
    const handlePointerUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  useEffect(() => {
    if (isClicking) {
      scale.set(0.75);
    } else if (isMagnetic) {
      scale.set(2.2);
    } else if (isHovering) {
      scale.set(1.6);
    } else {
      scale.set(1);
    }
  }, [isClicking, isHovering, isMagnetic, scale]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer Magnetic Glowing Halo / Ring */}
      <motion.div
        aria-hidden="true"
        style={{
          x: ringX,
          y: ringY,
          scale: scale,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className={`pointer-events-none fixed top-0 left-0 z-[99999] rounded-full transition-opacity duration-300 will-change-transform ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${
          isHovering || isMagnetic
            ? "border-2 border-amber-400/70 dark:border-amber-400/80 bg-amber-500/10"
            : "border border-amber-500/40 dark:border-amber-400/40 bg-amber-500/5"
        }`}
        animate={{
          width: isMagnetic ? ringSize * 1.4 : ringSize,
          height: isMagnetic ? ringSize * 1.4 : ringSize,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Inner Precision Dot */}
      <motion.div
        aria-hidden="true"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: dotSize,
          height: dotSize,
        }}
        className={`pointer-events-none fixed top-0 left-0 z-[99999] rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-opacity duration-200 will-change-transform ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovering ? "scale-125" : "scale-100"}`}
      />
    </>
  );
}

export default MagneticCursor;
