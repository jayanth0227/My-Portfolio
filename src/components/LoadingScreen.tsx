"use client";

import React from "react";
import { usePortfolioContent } from "@/context/PortfolioContentContext";

interface LoadingScreenProps {
  isVisible: boolean;
}

export default function LoadingScreen({ isVisible }: LoadingScreenProps) {
  const { content } = usePortfolioContent();
  const brandName =
    content.navbar?.brandName || content.about?.fullName || "Jayanth Sai Chikkala";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)] transition-all duration-700 ease-out select-none ${
        isVisible
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-105 pointer-events-none"
      }`}
    >
      {/* Background Soft Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] rounded-full bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-indigo-500/10 blur-3xl" />
      </div>

      {/* Hexagonal Spinner */}
      <div className="relative flex items-center justify-center loading-hex-spinner mb-6 sm:mb-8">
        <svg width="72" height="72" viewBox="0 0 64 64" className="drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]">
          <polygon
            points="32,2 58,17 58,47 32,62 6,47 6,17"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="loading-hex-path"
          />
        </svg>

        {/* Inner Glowing Core Dot */}
        <div className="absolute size-2.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-ping opacity-75" />
        <div className="absolute size-2 rounded-full bg-amber-500 dark:bg-amber-400" />
      </div>

      {/* Signature Name */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <span className="font-signature text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-500 bg-clip-text text-transparent loading-name-pulse drop-shadow-sm">
          {brandName}
        </span>

        {/* Animated Subtitle / Loading Indicator */}
        <div className="flex items-center gap-2 mt-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
