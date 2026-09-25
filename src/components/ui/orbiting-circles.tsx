import React from "react";
import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
  paused?: boolean;
  zIndex?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  paused = false,
  zIndex = 10,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const childrenArray = React.Children.toArray(children);
  const count = childrenArray.length;

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-neutral-300/80 stroke-1 dark:stroke-neutral-800/80 [stroke-dasharray:4_4]"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {childrenArray.map((child, index) => {
        const angle = (360 / (count || 1)) * index;
        return (
          <div
            key={index}
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                "--icon-size": `${iconSize}px`,
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                animationDirection: reverse ? "reverse" : "normal",
                animationPlayState: paused ? "paused" : "running",
                zIndex: zIndex,
              } as React.CSSProperties
            }
            className={cn(
              "absolute flex items-center justify-center transform-gpu hover:[animation-play-state:paused] hover:!z-50",
              reverse ? "animate-orbit-reverse" : "animate-orbit"
            )}
            {...props}
          >
            <div className={cn("relative flex items-center justify-center w-full h-full rounded-full", className)}>
              {child}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default OrbitingCircles;
