"use client";

import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollVelocityContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function ScrollVelocityContainer({
  children,
  className,
  ...props
}: ScrollVelocityContainerProps) {
  return (
    <div
      className={cn("w-full overflow-hidden select-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface ScrollVelocityRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  baseVelocity?: number;
  direction?: 1 | -1;
  className?: string;
  numCopies?: number;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function ScrollVelocityRow({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  numCopies = 6,
  ...props
}: ScrollVelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-100 / numCopies, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    const moveBy =
      (direction * baseVelocity + direction * velocityFactor.get()) *
      (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="flex flex-nowrap overflow-hidden whitespace-nowrap"
      {...props}
    >
      <motion.div
        className={cn(
          "flex flex-nowrap items-center whitespace-nowrap",
          className
        )}
        style={{ x }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <span key={i} className="inline-block px-4">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
