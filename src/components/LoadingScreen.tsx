"use client";

import React from "react";

interface LoadingScreenProps {
  isVisible: boolean;
}

export default function LoadingScreen({ isVisible }: LoadingScreenProps) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)] transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-105 pointer-events-none"
      }`}
    >
      {/* Hexagonal Spinner */}
      <div className="loading-hex-spinner mb-8">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <polygon
            points="32,2 58,17 58,47 32,62 6,47 6,17"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="loading-hex-path"
          />
        </svg>
      </div>

      {/* Signature Name */}
      <span className="font-signature text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-500 dark:text-amber-400 loading-name-pulse select-none">
        Jayanth Sai Chikkala
      </span>
    </div>
  );
}
