"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import InteractiveHexagonBackground from "@/components/InteractiveHexagonBackground";
import { Lens } from "@/components/ui/lens";
import { usePortfolioContent } from "@/context/PortfolioContentContext";

export default function Hero() {
  const { content } = usePortfolioContent();
  const hero = content.hero;
  const navbar = content.navbar;

  return (
    <section
      id="home"
      className="relative flex min-h-dvh lg:h-dvh w-full items-center justify-center overflow-hidden bg-[var(--background)] px-4 sm:px-6 lg:px-10 xl:px-14 pt-16 sm:pt-20 lg:pt-14 xl:pt-18 pb-4 lg:pb-0"
    >
      {/* Interactive Anti-Gravity Magnetic Field Hexagon Background */}
      <InteractiveHexagonBackground radius={42} strokeDasharray="4 2" />

      {/* Foreground Hero Content: Balanced Two-Column Responsive Layout */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] flex-col items-center justify-between lg:flex-row lg:items-end">
        
        {/* Left Column: Headline, Bio & Interactive Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left lg:my-auto pt-4 sm:pt-6 lg:pt-0 pb-6 lg:pb-0 max-w-xl xl:max-w-2xl"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3.5 py-1 text-xs font-medium text-[var(--muted-fg)] shadow-xs mb-3 sm:mb-4 lg:mb-3 xl:mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{hero.badgeText || "Available for New Projects"}</span>
          </div>

          <div className="py-0.5 sm:py-1">
            <Lens
              zoomFactor={1.5}
              lensSize={160}
              ariaLabel="Interactive Zoom for Title and Description"
              className="rounded-2xl"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.5rem] 2xl:text-[4.2rem] font-extrabold tracking-tight leading-[1.1] sm:leading-[1.12]">
                <span className="text-[var(--foreground)]">{hero.titleLine1 || "Building Scalable"}</span>
                <br />
                <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
                  {hero.titleLine2 || "Digital Experiences"}
                </span>
              </h1>

              <p className="mt-2.5 sm:mt-3.5 lg:mt-2.5 xl:mt-4 max-w-lg lg:max-w-xl text-xs sm:text-sm lg:text-[0.95rem] xl:text-base text-[var(--muted-fg)] mx-auto lg:mx-0 leading-relaxed">
                {hero.description || (
                  <>
                    <span className="text-[var(--foreground)] font-medium">Java &amp; Spring Boot</span> Full Stack Developer crafting scalable, production-ready applications with modern frontend technologies, robust backend APIs, cloud infrastructure, and clean architecture.
                  </>
                )}
              </p>
            </Lens>
          </div>

          {/* Action Buttons: Perfectly positioned above the fold */}
          <div className="mt-4 sm:mt-6 lg:mt-4 xl:mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <a
              href="#contact"
              className="rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-5 py-2.5 sm:px-6 sm:py-3 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 text-xs sm:text-sm font-bold text-zinc-950 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/40 hover:brightness-105 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              {hero.contactButtonText || "Get In Touch"}
            </a>
            <a
              href="/api/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-[2px] border-amber-500 dark:border-amber-400 bg-transparent px-5 py-2.5 sm:px-6 sm:py-3 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 shadow-xs hover:bg-amber-500/10 hover:border-amber-500 dark:hover:border-amber-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {hero.resumeButtonText || "Download CV"}
            </a>
          </div>
        </motion.div>

        {/* Right Column: Developer Cutout Portrait touching bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative flex flex-shrink-0 items-end justify-center self-end w-full lg:w-auto mt-auto"
        >
          {/* Warm ambient neon glow halo behind portrait */}
          <div
            style={{ transformOrigin: "bottom center" }}
            className="absolute bottom-0 h-[90%] w-[94%] rounded-full bg-gradient-to-t from-yellow-300/40 via-amber-200/25 to-yellow-100/10 dark:from-yellow-600/25 dark:via-amber-700/15 dark:to-transparent blur-3xl pointer-events-none transform-gpu"
          />

          <div className="relative z-10 flex items-end justify-center [mask-image:linear-gradient(to_bottom,black_74%,transparent_100%)] lg:[mask-image:none]">
            <Image
              src={hero.avatarUrl || "/profile.png"}
              alt={`${navbar?.brandName || "Developer"} Portrait`}
              width={1024}
              height={1024}
              priority
              style={{ width: "auto" }}
              className="h-[42vh] sm:h-[48vh] md:h-[54vh] lg:h-[76vh] xl:h-[82vh] 2xl:h-[86vh] max-h-[780px] xl:max-h-[850px] object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)] pointer-events-none select-none block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
