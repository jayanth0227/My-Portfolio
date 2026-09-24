"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import InteractiveHexagonBackground from "@/components/InteractiveHexagonBackground";
import { Lens } from "@/components/ui/lens";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen lg:h-screen w-full items-center justify-center overflow-hidden bg-[var(--background)] px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 lg:pt-0 pb-0"
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
          className="flex-1 text-center lg:text-left lg:my-auto pt-4 sm:pt-6 lg:pt-0 max-w-2xl"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3.5 py-1.5 text-xs font-medium text-[var(--muted-fg)] shadow-xs mb-4 sm:mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for New Projects</span>
          </div>

          <div className="py-1 sm:py-2">
            <Lens
              zoomFactor={1.7}
              lensSize={170}
              ariaLabel="Interactive Zoom for Title and Description"
              className="rounded-2xl"
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                Full-Stack Developer &amp; Cloud Engineer
              </h1>

              <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base lg:text-lg text-[var(--muted-fg)] mx-auto lg:mx-0">
                Building dynamic, cloud-native applications with Next.js, MongoDB, Cloudinary, and continuous deployment on AWS Amplify.
              </p>
            </Lens>
          </div>

          <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#projects"
              className="rounded-xl bg-[var(--btn-primary-bg)] px-6 py-3 text-sm font-semibold text-[var(--btn-primary-text)] shadow-sm hover:bg-[var(--btn-primary-hover)] transition-colors"
            >
              Explore Projects
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-[var(--btn-secondary-border)] bg-[var(--btn-secondary-bg)] px-6 py-3 text-sm font-semibold text-[var(--btn-secondary-text)] hover:bg-[var(--btn-secondary-hover)] transition-colors shadow-xs"
            >
              Get In Touch
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
              src="/profile.png"
              alt="Jayanth Sai Chikkala Portrait"
              width={1024}
              height={1024}
              priority
              style={{ width: "auto" }}
              className="h-[36vh] sm:h-[46vh] md:h-[60vh] lg:h-[84vh] xl:h-[90vh] 2xl:h-[94vh] max-h-[880px] object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] pointer-events-none select-none block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
