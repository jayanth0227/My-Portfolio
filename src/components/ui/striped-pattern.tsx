"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";
import InteractiveStripedBackground from "@/components/InteractiveStripedBackground";

export interface StripedPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  spacing?: number;
  strokeDasharray?: string;
  className?: string;
  /** When true (default), renders canvas with reactive magnetic physics & motion particles */
  interactive?: boolean;
  maxDisplacement?: number;
  interactionRadius?: number;
  particleCount?: number;
  [key: string]: unknown;
}

export function StripedPattern({
  width = 40,
  height = 40,
  spacing = 38,
  strokeDasharray = "4 2",
  className,
  interactive = true,
  maxDisplacement = 6,
  interactionRadius = 190,
  particleCount = 40,
  ...props
}: StripedPatternProps) {
  const id = useId();

  if (interactive) {
    return (
      <InteractiveStripedBackground
        spacing={spacing || width}
        strokeDasharray={strokeDasharray}
        maxDisplacement={maxDisplacement}
        interactionRadius={interactionRadius}
        particleCount={particleCount}
        className={className}
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80 stroke-neutral-400/80 dark:fill-neutral-600/80 dark:stroke-neutral-600/80",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={height}
            className="stroke-neutral-950/15 dark:stroke-white/10"
            strokeWidth="1"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default StripedPattern;
