"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface AnimatedThemeTogglerProps {
  className?: string;
  variant?: "star" | "hexagon" | "default";
  size?: number;
}

export function AnimatedThemeToggler({
  className = "",
  variant = "default",
  size = 40,
}: AnimatedThemeTogglerProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 600);
  }, [toggleTheme, isAnimating]);

  // Sun rays data
  const sunRays = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: i * 45,
  }));

  // Moon craters
  const craters = [
    { cx: 11, cy: 8, r: 1.5 },
    { cx: 14, cy: 13, r: 1 },
    { cx: 9, cy: 14, r: 1.2 },
  ];

  // Star sparkles for dark mode
  const stars = [
    { x: 3, y: 4, delay: 0 },
    { x: 19, y: 6, delay: 0.15 },
    { x: 6, y: 18, delay: 0.3 },
    { x: 17, y: 17, delay: 0.1 },
    { x: 2, y: 12, delay: 0.25 },
  ];

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleToggle}
      className={`relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Glow background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      <svg
        viewBox="0 0 24 24"
        width={size * 0.55}
        height={size * 0.55}
        className="relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.g
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Moon body */}
              <motion.path
                d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
                fill="currentColor"
                className="text-indigo-200"
                strokeWidth={0}
              />
              {/* Craters */}
              {craters.map((c, i) => (
                <motion.circle
                  key={i}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill="rgba(129, 140, 248, 0.3)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                />
              ))}
              {/* Stars twinkling */}
              {stars.map((s, i) => (
                <motion.circle
                  key={`star-${i}`}
                  cx={s.x}
                  cy={s.y}
                  r={0.7}
                  fill="rgba(199, 210, 254, 0.85)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0.6, 1],
                    scale: [0, 1.2, 0.8, 1],
                  }}
                  transition={{
                    delay: s.delay + 0.3,
                    duration: 1.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </motion.g>
          ) : (
            <motion.g
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Sun center circle */}
              <motion.circle
                cx="12"
                cy="12"
                r="4.5"
                fill="currentColor"
                className="text-amber-400"
                animate={{
                  r: [4.5, 5, 4.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
              {/* Sun rays */}
              {sunRays.map((ray) => (
                <motion.line
                  key={ray.id}
                  x1="12"
                  y1="12"
                  x2={12 + Math.cos((ray.angle * Math.PI) / 180) * 9}
                  y2={12 + Math.sin((ray.angle * Math.PI) / 180) * 9}
                  stroke="currentColor"
                  className="text-amber-400"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{
                    delay: 0.15 + ray.id * 0.04,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.button>
  );
}

export default AnimatedThemeToggler;
