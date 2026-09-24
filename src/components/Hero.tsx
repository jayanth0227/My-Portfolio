"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import InteractiveHexagonBackground from "@/components/InteractiveHexagonBackground";

export function HexagonPatternDashed() {
  return (
    <div className="bg-background relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border p-20">
      <InteractiveHexagonBackground radius={42} strokeDasharray="4 2" />
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white px-6 lg:px-12 pt-6 lg:pt-0 pb-0">
      {/* Interactive Anti-Gravity Magnetic Field Hexagon Background */}
      <InteractiveHexagonBackground
        radius={42}
        strokeDasharray="4 2"
      />

      {/* Foreground Hero Content: Balanced Two-Column Layout */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] flex-col items-center justify-between lg:flex-row lg:items-end">
        {/* Left Column: Headline, Bio & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left lg:my-auto pt-4 sm:pt-6 lg:pt-0 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-xs mb-4 sm:mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available for New Projects</span>
          </div>

          <div className="py-1 sm:py-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
              Full-Stack Developer &amp; Cloud Engineer
            </h1>

            <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base lg:text-lg text-neutral-600 mx-auto lg:mx-0">
              Building dynamic, cloud-native applications with Next.js, MongoDB, Cloudinary, and continuous deployment on AWS Amplify.
            </p>
          </div>

          <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#projects"
              className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-colors"
            >
              Explore Projects
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors shadow-xs"
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
          className="relative flex flex-shrink-0 items-end justify-center self-end w-full lg:w-auto"
        >
          {/* Subtle warm ambient neon glow halo behind portrait (hardware accelerated static gradient) */}
          <div
            style={{ transformOrigin: "bottom center" }}
            className="absolute bottom-0 h-[88%] w-[92%] rounded-full bg-gradient-to-t from-yellow-300/40 via-amber-200/25 to-yellow-100/10 blur-2xl pointer-events-none transform-gpu"
          />

          <div className="relative z-10 flex items-end justify-center">
            <Image
              src="/profile.png"
              alt="Jayanth Sai Chikkala Portrait"
              width={1024}
              height={1024}
              priority
              style={{ width: "auto" }}
              className="h-[46vh] sm:h-[55vh] md:h-[65vh] lg:h-[84vh] xl:h-[90vh] 2xl:h-[94vh] max-h-[880px] object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] pointer-events-none select-none block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
