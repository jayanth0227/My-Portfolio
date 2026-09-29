"use client";

import React, { useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // Distance multiplier (0.1 to 0.6)
  radius?: number; // Active attraction radius in pixels
  className?: string;
  asChild?: boolean;
}

export function Magnetic({
  children,
  strength = 0.35,
  radius = 100,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance < radius) {
      // Calculate smooth falloff
      const power = (1 - distance / radius) * strength;
      x.set(dx * power);
      y.set(dy * power);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: smoothX, y: smoothY }}
      onPointerMove={handleMouseMove}
      onPointerLeave={handlePointerLeave}
      data-magnetic="true"
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Magnetic;
