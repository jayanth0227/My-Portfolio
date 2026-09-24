"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Hexagon,
  Check,
} from "lucide-react";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";

export default function About() {
  // Smooth 3D Tilt Card Interaction (Hardware accelerated)
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 260,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 260,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply tilt on pointer devices with hover capability
    if (window.matchMedia("(hover: none)").matches) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-7xl xl:max-w-[1400px] px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: ID Card Matching Reference Exactly */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          {/* Lanyard Top Fixture (Matching Mustard Strap & Metal Swivel Clip) */}
          <div className="relative flex flex-col items-center pointer-events-none z-20 -mb-2.5 sm:-mb-3">
            {/* Mustard Fabric Lanyard Ribbon */}
            <div className="w-12 sm:w-14 h-10 sm:h-13 bg-gradient-to-r from-[var(--lanyard-from)] via-[var(--lanyard-via)] to-[var(--lanyard-to)] shadow-sm relative overflow-hidden flex justify-center">
              {/* Vertical weave stitch lines */}
              <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)]" />
              <div className="absolute inset-y-0 w-[1px] bg-black/15 left-1" />
              <div className="absolute inset-y-0 w-[1px] bg-black/15 right-1" />
            </div>

            {/* Metal Strap Clamp / Buckle */}
            <div className="w-14 sm:w-16 h-2.5 sm:h-3 bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-400 dark:from-neutral-500 dark:via-neutral-400 dark:to-neutral-600 rounded-xs border border-neutral-400/80 dark:border-neutral-500/80 shadow-xs z-10 -mt-0.5" />

            {/* Metal Swivel Loop & Hook */}
            <div className="flex flex-col items-center -mt-0.5 z-10">
              {/* Loop */}
              <div className="w-4.5 sm:w-5 h-3.5 sm:h-4 border-2 border-neutral-400/90 dark:border-neutral-500/90 rounded-t-md bg-transparent" />
              {/* Swivel Pivot */}
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-500 border border-neutral-500 dark:border-neutral-600 -mt-1 shadow-2xs" />
              {/* Metal Clasp / Hook passing through the slot */}
              <div className="w-3.5 sm:w-4 h-3.5 sm:h-4 border-2 border-neutral-500 dark:border-neutral-400 rounded-b-md bg-transparent -mt-0.5" />
            </div>
          </div>

          {/* Realistic Physical ID Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="group relative w-full max-w-[270px] sm:max-w-[295px] lg:max-w-[305px] bg-[var(--card-bg)] rounded-3xl shadow-[0_15px_40px_-10px_var(--card-shadow)] border border-[var(--card-border)] overflow-hidden select-none transition-shadow duration-300 hover:shadow-[0_20px_50px_-10px_var(--card-shadow-hover)]"
          >
            {/* Lanyard Oval Slot Punch Hole at Top Center */}
            <div className="mx-auto mt-3.5 sm:mt-4 w-11 sm:w-12 h-2 sm:h-2.5 rounded-full bg-neutral-300/80 dark:bg-neutral-600/80 border border-neutral-400/80 dark:border-neutral-500/80 shadow-inner flex items-center justify-center">
              <div className="w-8 sm:w-9 h-1 rounded-full bg-neutral-400/70 dark:bg-neutral-500/70" />
            </div>

            {/* Card Content Header: Logo & Company Name */}
            <div className="pt-2.5 sm:pt-3 px-5 sm:px-6 flex items-center justify-center gap-2 sm:gap-2.5">
              {/* Golden Hexagon Checkmark Logo */}
              <div className="relative flex items-center justify-center text-[var(--accent)]">
                <Hexagon className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2] fill-[var(--accent-light)] text-[var(--accent)]" />
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3] text-[var(--accent)] absolute" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[11px] sm:text-[12px] font-bold tracking-wider text-[var(--foreground)] uppercase">
                  JAYANTH
                </span>
                <span className="text-[12px] sm:text-[13px] font-black tracking-widest text-[var(--accent)] uppercase">
                  PORTFOLIO
                </span>
              </div>
            </div>

            {/* Profile Avatar with Golden Circular Ring */}
            <div className="mt-3 sm:mt-4 flex justify-center">
              <div className="relative p-1 rounded-full border-2 border-[var(--accent)] shadow-xs">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-[var(--muted)]">
                  <Image
                    src="/id-avatar.webp"
                    alt="Jayanth Sai Chikkala Avatar"
                    fill
                    sizes="110px"
                    priority
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Name & Designation */}
            <div className="mt-3 text-center px-3 sm:px-4">
              <h3 className="text-base sm:text-lg font-black text-[var(--foreground)] tracking-tight uppercase leading-tight">
                JAYANTH SAI CHIKKALA
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[var(--accent)]">
                SOFTWARE DEVELOPER
              </p>
            </div>

            {/* ID Credentials Table */}
            <div className="mt-3 sm:mt-4 px-5 sm:px-6 space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--foreground)] tracking-wider">ID NUMBER</span>
                <span className="font-black text-[var(--foreground)] tracking-wide">987654321</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--foreground)] tracking-wider">VALID THROUGH</span>
                <span className="font-black text-[var(--foreground)] tracking-wide">12/31/2026</span>
              </div>
            </div>

            {/* Bottom Mustard/Gold Accent Block with Inset QR Code */}
            <div className="mt-4 sm:mt-5 bg-gradient-to-r from-[#d97706] to-[var(--accent)] px-5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between">
              {/* Left detail on the banner */}
              <div className="flex flex-col text-white">
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase opacity-85">
                  STATUS
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                  VERIFIED DEV
                </span>
              </div>

              {/* White Inset QR Code Matching Reference */}
              <div className="bg-white p-1 rounded-md shadow-xs">
                <svg
                  className="w-9 h-9 sm:w-11 sm:h-11 text-neutral-900"
                  viewBox="0 0 29 29"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Position Patterns */}
                  <rect x="1" y="1" width="7" height="7" fill="black" />
                  <rect x="2" y="2" width="5" height="5" fill="white" />
                  <rect x="3" y="3" width="3" height="3" fill="black" />
                  <rect x="21" y="1" width="7" height="7" fill="black" />
                  <rect x="22" y="2" width="5" height="5" fill="white" />
                  <rect x="23" y="3" width="3" height="3" fill="black" />
                  <rect x="1" y="21" width="7" height="7" fill="black" />
                  <rect x="2" y="22" width="5" height="5" fill="white" />
                  <rect x="3" y="23" width="3" height="3" fill="black" />
                  {/* QR Data Pattern */}
                  <rect x="10" y="2" width="2" height="2" fill="black" />
                  <rect x="14" y="1" width="2" height="3" fill="black" />
                  <rect x="18" y="2" width="2" height="2" fill="black" />
                  <rect x="10" y="6" width="3" height="2" fill="black" />
                  <rect x="15" y="6" width="2" height="2" fill="black" />
                  <rect x="10" y="10" width="2" height="2" fill="black" />
                  <rect x="13" y="10" width="3" height="2" fill="black" />
                  <rect x="17" y="10" width="2" height="3" fill="black" />
                  <rect x="21" y="10" width="3" height="2" fill="black" />
                  <rect x="26" y="10" width="2" height="2" fill="black" />
                  <rect x="1" y="10" width="2" height="3" fill="black" />
                  <rect x="5" y="10" width="2" height="2" fill="black" />
                  <rect x="2" y="15" width="3" height="2" fill="black" />
                  <rect x="7" y="14" width="2" height="3" fill="black" />
                  <rect x="11" y="14" width="3" height="2" fill="black" />
                  <rect x="15" y="14" width="2" height="3" fill="black" />
                  <rect x="19" y="14" width="3" height="2" fill="black" />
                  <rect x="24" y="14" width="3" height="2" fill="black" />
                  <rect x="10" y="18" width="2" height="3" fill="black" />
                  <rect x="14" y="18" width="3" height="2" fill="black" />
                  <rect x="19" y="18" width="2" height="3" fill="black" />
                  <rect x="23" y="18" width="3" height="2" fill="black" />
                  <rect x="10" y="23" width="3" height="2" fill="black" />
                  <rect x="15" y="22" width="2" height="3" fill="black" />
                  <rect x="19" y="23" width="3" height="2" fill="black" />
                  <rect x="24" y="22" width="2" height="3" fill="black" />
                  <rect x="10" y="26" width="2" height="2" fill="black" />
                  <rect x="14" y="26" width="3" height="2" fill="black" />
                  <rect x="18" y="26" width="2" height="2" fill="black" />
                  <rect x="22" y="25" width="2" height="3" fill="black" />
                  <rect x="26" y="26" width="2" height="2" fill="black" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Mac Terminal Displaying Developer Introduction */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] px-3 py-1 text-xs font-semibold text-[var(--badge-text)] shadow-2xs mb-2 w-fit">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Developer Console</span>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight mb-3">
            Building User-Centric, Scalable Solutions Across All Platforms
          </h2>

          {/* Interactive Magic UI Terminal Component */}
          <div className="w-full shadow-xl rounded-xl overflow-hidden">
            <Terminal className="max-w-none w-full bg-[var(--terminal-bg)] border-[var(--terminal-border)] text-[var(--terminal-text)] font-mono text-xs sm:text-sm">
              <TypingAnimation duration={30}>$ whoami</TypingAnimation>

              <AnimatedSpan className="text-emerald-400">
                ✔ Jayanth Sai Chikkala — Software Developer &amp; Solutions Architect
              </AnimatedSpan>

              <TypingAnimation duration={25}>$ cat about.md</TypingAnimation>

              <AnimatedSpan className="text-zinc-300 dark:text-zinc-400">
                Building user-centric, high-impact digital applications across platforms.
              </AnimatedSpan>

              <AnimatedSpan className="text-zinc-400 dark:text-zinc-500">
                Passionate about transforming complex workflows into intuitive, resilient software.
              </AnimatedSpan>

              <TypingAnimation duration={25}>$ pnpm run capabilities</TypingAnimation>

              <AnimatedSpan className="text-emerald-400">
                ✔ Web Applications   — High-performance Next.js &amp; React cloud systems
              </AnimatedSpan>

              <AnimatedSpan className="text-emerald-400">
                ✔ Enterprise ERPs    — Scalable workflow engines &amp; operational platforms
              </AnimatedSpan>

              <AnimatedSpan className="text-emerald-400">
                ✔ Mobile Apps        — Cross-platform iOS &amp; Android apps with fluid UX
              </AnimatedSpan>

              <AnimatedSpan className="text-emerald-400">
                ✔ Desktop Apps       — Native-grade desktop tools built for stability
              </AnimatedSpan>

              <TypingAnimation duration={25}>$ echo $DEV_STATUS</TypingAnimation>

              <AnimatedSpan className="text-amber-400">
                ▲ Available for New High-Impact Engineering Projects
              </AnimatedSpan>
            </Terminal>
          </div>

          {/* Bottom Bar: Badges & CTA */}
          <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[var(--border)]">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--pill-bg)] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[var(--pill-text)]">
                ⚡ Cloud-Native
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--pill-bg)] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[var(--pill-text)]">
                🔒 Scalable ERP &amp; Systems
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--pill-bg)] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[var(--pill-text)]">
                🎯 Web • Mobile • Desktop
              </span>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--btn-primary-bg)] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-[var(--btn-primary-text)] shadow-xs transition-all duration-200 hover:bg-[var(--btn-primary-hover)]"
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
