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
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[var(--background)] px-4 sm:px-6 lg:px-12 pt-20 sm:pt-22 lg:pt-20 pb-4 lg:pb-0"
    >
      {/* Interactive Anti-Gravity Magnetic Field Hexagon Background */}
      <InteractiveHexagonBackground radius={42} strokeDasharray="4 2" />

      {/* Foreground Hero Content: Balanced Two-Column Layout */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] flex-col items-center justify-between lg:flex-row lg:items-end">
        {/* Left Column: Headline, Bio & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left lg:my-auto pt-2 sm:pt-4 lg:pt-0 max-w-2xl"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3.5 py-1.5 text-xs font-medium text-[var(--muted-fg)] shadow-xs mb-4 sm:mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{hero.badgeText || "Available for New Projects"}</span>
          </div>

          <div className="py-1 sm:py-2">
            <Lens
              zoomFactor={1.7}
              lensSize={170}
              ariaLabel="Interactive Zoom for Title and Description"
              className="rounded-2xl"
            >
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                <span className="text-[var(--foreground)]">{hero.titleLine1 || "Building Scalable"}</span>
                <br />
                <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
                  {hero.titleLine2 || "Digital Experiences"}
                </span>
              </h1>

              <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base lg:text-lg text-[var(--muted-fg)] mx-auto lg:mx-0 leading-relaxed">
                {hero.description || (
                  <>
                    <span className="text-[var(--foreground)] font-medium">Java &amp; Spring Boot</span> Full Stack Developer crafting scalable, production-ready applications with modern frontend technologies, robust backend APIs, cloud infrastructure, and clean architecture.
                  </>
                )}
              </p>
            </Lens>
          </div>

          <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#contact"
              className="rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-6 py-3 text-sm font-bold text-zinc-950 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/40 hover:brightness-105 active:scale-[0.98] transition-all duration-300"
            >
              {hero.contactButtonText || "Get In Touch"}
            </a>
            <a
              href="/api/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-amber-500 dark:border-amber-400 bg-transparent px-6 py-3 text-sm font-bold text-amber-600 dark:text-amber-400 shadow-xs hover:bg-amber-500/10 hover:border-amber-500 dark:hover:border-amber-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {hero.resumeButtonText || "Download CV"}
            </a>
          </div>
        </motion.div>

        {/* Right Column: Developer Cutout Portrait touching bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative flex flex-shrink-0 items-end justify-center self-end w-full lg:w-auto mt-auto pt-4"
        >
          {/* Warm ambient neon glow halo behind portrait */}
          <div
            style={{ transformOrigin: "bottom center" }}
            className="absolute bottom-0 h-[88%] w-[92%] rounded-full bg-gradient-to-t from-yellow-300/40 via-amber-200/25 to-yellow-100/10 dark:from-yellow-600/20 dark:via-amber-700/10 dark:to-transparent blur-2xl pointer-events-none transform-gpu"
          />

          <div className="relative z-10 flex items-end justify-center [mask-image:linear-gradient(to_bottom,black_74%,transparent_100%)] lg:[mask-image:none]">
            <Image
              src={hero.avatarUrl || "/profile.png"}
              alt={`${navbar?.brandName || "Developer"} Portrait`}
              width={1024}
              height={1024}
              priority
              style={{ width: "auto" }}
              className="h-[42vh] sm:h-[50vh] md:h-[55vh] lg:h-[76vh] xl:h-[80vh] 2xl:h-[84vh] max-h-[800px] object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] pointer-events-none select-none block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
