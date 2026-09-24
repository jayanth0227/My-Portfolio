"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";
import InteractiveGridBackground from "@/components/InteractiveGridBackground";

export interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
  /** When true (default), renders interactive canvas with reactive particles and physics */
  interactive?: boolean;
  maxDisplacement?: number;
  [key: string]: unknown;
}

export function GridPattern({
  width = 30,
  height = 30,
  x = -1,
  y = -1,
  strokeDasharray = "4 2",
  squares,
  className,
  interactive = true,
  maxDisplacement = 5.5,
  ...props
}: GridPatternProps) {
  const id = useId();

  if (interactive) {
    return (
      <InteractiveGridBackground
        width={width}
        height={height}
        x={x}
        y={y}
        strokeDasharray={strokeDasharray}
        squares={squares}
        maxDisplacement={maxDisplacement}
        className={className}
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/30 stroke-neutral-400/30",
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
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sqX, sqY]) => (
            <rect
              strokeWidth="0"
              key={`${sqX}-${sqY}`}
              width={width - 1}
              height={height - 1}
              x={sqX * width + 1}
              y={sqY * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

export function GridPatternDashed() {
  return (
    <div className="bg-background relative flex size-full items-center justify-center overflow-hidden rounded-lg border p-20">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
}

export default GridPattern;
