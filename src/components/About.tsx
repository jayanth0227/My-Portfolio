"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Phone,
  Droplets,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";
import { usePortfolioContent } from "@/context/PortfolioContentContext";

export default function About() {
  const { content } = usePortfolioContent();
  const about = content.about;

  // Smooth 3D Tilt Card Interaction (Hardware accelerated)
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 200,
    damping: 30,
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
    <div className="relative z-10 mx-auto w-full max-w-7xl xl:max-w-[1400px] px-4 sm:px-6 lg:px-10 py-2 sm:py-3 lg:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: ID Card Matching Reference Exactly */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="id-card-hanging">
          {/* Lanyard Top Fixture (Mustard Strap, Metal Swivel & Lobster Clasp Hooking Through the Hole) */}
          <div className="relative flex flex-col items-center pointer-events-none z-30 -mb-6 sm:-mb-7">
            {/* Mustard Fabric Lanyard Ribbon */}
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r from-[var(--lanyard-from)] via-[var(--lanyard-via)] to-[var(--lanyard-to)] shadow-md relative overflow-hidden flex justify-center rounded-t-xs">
              {/* Vertical weave stitch lines & texture */}
              <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)]" />
              <div className="absolute inset-y-0 w-[1.5px] bg-black/20 left-1.5" />
              <div className="absolute inset-y-0 w-[1.5px] bg-black/20 right-1.5" />
              <div className="absolute inset-y-0 w-[1px] bg-white/20 left-2.5" />
              <div className="absolute inset-y-0 w-[1px] bg-white/20 right-2.5" />
            </div>

            {/* Metal Strap Clamp / Buckle with Grip Ribs */}
            <div className="w-14 sm:w-16 h-3 sm:h-3.5 bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 dark:from-neutral-600 dark:via-neutral-300 dark:to-neutral-600 rounded-[2px] border border-neutral-400/90 dark:border-neutral-500/90 shadow-sm z-20 -mt-0.5 flex flex-col justify-center items-center gap-[2px]">
              <div className="w-11 sm:w-13 h-[1px] bg-neutral-500/60 dark:bg-neutral-700/60 shadow-[0_1px_0_rgba(255,255,255,0.6)]" />
              <div className="w-11 sm:w-13 h-[1px] bg-neutral-500/60 dark:bg-neutral-700/60 shadow-[0_1px_0_rgba(255,255,255,0.6)]" />
            </div>

            {/* Metal Swivel Loop & Lobster Clasp Assembly */}
            <div className="relative flex flex-col items-center -mt-0.5 z-20">
              {/* Swivel D-Ring */}
              <div className="w-5 sm:w-5.5 h-3.5 sm:h-4 border-[2.5px] border-neutral-400 dark:border-neutral-400 rounded-t-md bg-transparent shadow-2xs" />
              {/* Swivel Pivot Barrel */}
              <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-[2px] bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400 dark:from-neutral-600 dark:via-neutral-300 dark:to-neutral-600 border border-neutral-500 dark:border-neutral-600 -mt-1 shadow-xs flex items-center justify-center">
                <div className="w-1.5 h-[1px] bg-neutral-600 dark:bg-neutral-400" />
              </div>

              {/* Realistic Metal Lobster Clasp / Hook - Hooks physically into the Hole */}
              <svg
                className="w-8 sm:w-9 h-11 sm:h-12 -mt-1 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
                viewBox="0 0 36 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="chromeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="35%" stopColor="#ffffff" />
                    <stop offset="65%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                  <linearGradient id="chromeDark" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>

                {/* Swivel Collar */}
                <rect x="14" y="2" width="8" height="3.5" rx="1" fill="url(#chromeGradient)" stroke="#64748b" strokeWidth="0.75" />

                {/* Clasp Body */}
                <path
                  d="M13 5.5 C13 5.5, 11 11, 11 17 C11 23, 14 27, 18 27 C22 27, 25 23, 25 17 C25 11, 23 5.5, 23 5.5 Z"
                  fill="url(#chromeGradient)"
                  stroke="#475569"
                  strokeWidth="1"
                />

                {/* Clasp Spring Trigger Lever */}
                <path
                  d="M23 11.5 L28 13.5 C28.5 13.7, 28.5 15.3, 28 15.5 L23 17"
                  fill="url(#chromeGradient)"
                  stroke="#475569"
                  strokeWidth="0.75"
                />
                <circle cx="27" cy="14.5" r="0.9" fill="#475569" />

                {/* Clasp Center Split Line */}
                <path
                  d="M18 9 L18 23"
                  stroke="#475569"
                  strokeWidth="1"
                  strokeLinecap="round"
                />

                {/* Metal Hook Arm - Descends and Loops into & through the Hole */}
                <path
                  d="M14 25 C14 31, 14 37, 16 41 C17.5 44, 20 45, 22 44 C24 42.5, 24.5 39, 23 34 C22 31, 20 29, 18 27"
                  fill="none"
                  stroke="url(#chromeGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Metallic Highlight on Hook */}
                <path
                  d="M14.5 27 C14.5 32, 14.8 37, 16.5 40 C17.5 42, 19.5 43, 21 42.5"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </svg>
            </div>
          </div>

          {/* Realistic Physical ID Card with Curved Top Hanger Section */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="group relative w-full max-w-[270px] sm:max-w-[295px] lg:max-w-[305px] bg-[var(--card-bg)] rounded-t-[44px] sm:rounded-t-[52px] rounded-b-3xl shadow-[0_15px_40px_-10px_var(--card-shadow)] border border-[var(--card-border)] overflow-hidden select-none transition-shadow duration-300 hover:shadow-[0_20px_50px_-10px_var(--card-shadow-hover)]"
          >
            {/* Top Glossy Bevel Highlight along Curved Top Arch */}
            <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/30 dark:from-white/10 via-white/5 to-transparent pointer-events-none" />

            {/* Curved Top Section Badge Header with Cutout Slot Punch Hole */}
            <div className="relative pt-3.5 sm:pt-4 pb-0.5 flex flex-col items-center justify-center">
              {/* Lanyard Oval Slot Punch Hole - Realistic Cutout with 3D Beveled Rim */}
              <div className="relative w-12 sm:w-14 h-3 sm:h-3.5 rounded-full bg-neutral-200/50 dark:bg-neutral-900/60 border-[1.5px] border-neutral-400/80 dark:border-neutral-500/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
                {/* Background cutout depth */}
                <div className="absolute inset-0 bg-black/15 dark:bg-black/50" />
                {/* Metal hook loop visible through the hole */}
                <div className="w-5 sm:w-6 h-1.5 rounded-full bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400 dark:from-neutral-500 dark:via-neutral-300 dark:to-neutral-500 opacity-90 shadow-inner" />
              </div>
            </div>

            {/* Card Content Header: Company Logo & Name */}
            <div className="pt-2.5 sm:pt-3 px-5 sm:px-6 flex items-center justify-center gap-2 sm:gap-2.5">
              {/* Company Building Icon / Uploaded Logo */}
              <div className="relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 overflow-hidden p-1">
                {about?.companyLogoUrl ? (
                  <img
                    src={about.companyLogoUrl}
                    alt="Company Logo"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Building2 className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[var(--accent)]" />
                )}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[11px] sm:text-[12px] font-bold tracking-wider text-[var(--foreground)] uppercase">
                  {about?.companyLine1 || "SPESHWAY"}
                </span>
                <span className="text-[12px] sm:text-[13px] font-black tracking-widest text-[var(--accent)] uppercase">
                  {about?.companyLine2 || "SOLUTIONS"}
                </span>
              </div>
            </div>

            {/* Profile Avatar with Golden Circular Ring */}
            <div className="mt-3 sm:mt-4 flex justify-center">
              <div className="relative p-1 rounded-full border-2 border-[var(--accent)] shadow-xs">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-[var(--muted)]">
                  <Image
                    src={about?.idCardPhotoUrl || "/id-avatar.webp"}
                    alt={`${about?.fullName || "Developer"} ID Photo`}
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
                {about?.fullName || "JAYANTH SAI CHIKKALA"}
              </h3>
              <p className="mt-0.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[var(--accent)]">
                {about?.designation || "ASSOCIATE SOFTWARE ENGINEER"}
              </p>
            </div>

            {/* Contact & Personal Info */}
            <div className="mt-3 sm:mt-4 px-5 sm:px-6 space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--foreground)] tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-[var(--accent)]" />
                  MOBILE
                </span>
                <span className="font-black text-[var(--foreground)] tracking-wide">
                  {about?.mobile || "+91 9010253076"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--foreground)] tracking-wider flex items-center gap-1.5">
                  <Droplets className="h-3 w-3 text-red-500" />
                  BLOOD GROUP
                </span>
                <span className="font-black text-[var(--foreground)] tracking-wide">
                  {about?.bloodGroup || "O+"}
                </span>
              </div>
            </div>

            {/* Bottom Mustard/Gold Accent Block with Employee Badge & LinkedIn QR Code */}
            <div className="mt-4 sm:mt-5 bg-gradient-to-r from-[#d97706] to-[var(--accent)] px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 overflow-hidden rounded-b-3xl">
              {/* Left: Employee Badge & Department */}
              <div className="flex flex-col text-white min-w-0 flex-1 pr-1 justify-center">
                <span className="text-[7.5px] sm:text-[8.5px] font-mono font-bold tracking-widest uppercase opacity-90 truncate leading-none mb-0.5">
                  {about?.footerRole || "EMPLOYEE"}
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold tracking-tight uppercase leading-snug break-words">
                  {about?.footerDepartment || "SOFTWARE DEVELOPMENT"}
                </span>
              </div>

              {/* Right: LinkedIn QR Code */}
              <div className="bg-white p-1 rounded-md shadow-xs shrink-0 flex items-center justify-center">
                <QRCodeSVG
                  value={about?.linkedinUrl || "https://www.linkedin.com/in/jayanth-sai-chikkala/"}
                  size={32}
                  bgColor="#ffffff"
                  fgColor="#171717"
                  level="L"
                  className="w-7 h-7 sm:w-8 sm:h-8"
                />
              </div>
            </div>
          </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN: Mac Terminal Displaying Developer Introduction */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] px-3 py-1 text-xs font-semibold text-[var(--badge-text)] shadow-2xs mb-2 w-fit">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{about?.terminalBadge || "Developer Console"}</span>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight mb-3">
            {about?.terminalHeading || "Building User-Centric, Scalable Solutions Across All Platforms"}
          </h2>

          {/* Interactive Magic UI Terminal Component */}
          <div className="w-full shadow-xl rounded-xl overflow-hidden">
            <Terminal className="max-w-none w-full bg-[var(--terminal-bg)] border-[var(--terminal-border)] text-[var(--terminal-text)] font-mono text-xs sm:text-sm">
              <TypingAnimation duration={30}>$ whoami</TypingAnimation>

              <AnimatedSpan className="text-emerald-400">
                ✔ {about?.terminalWhoami || `${about?.fullName || "Jayanth Sai Chikkala"} — ${about?.designation || "Associate Software Engineer"}`}
              </AnimatedSpan>

              <TypingAnimation duration={25}>$ cat about.md</TypingAnimation>

              <AnimatedSpan className="text-zinc-300 dark:text-zinc-400">
                {about?.terminalAbout1 || "Building user-centric, high-impact digital applications across platforms."}
              </AnimatedSpan>

              <AnimatedSpan className="text-zinc-400 dark:text-zinc-500">
                {about?.terminalAbout2 || "Passionate about transforming complex workflows into intuitive, resilient software."}
              </AnimatedSpan>

              <TypingAnimation duration={25}>$ pnpm run capabilities</TypingAnimation>

              <AnimatedSpan className="text-emerald-400">
                ✔ {about?.terminalCapability1 || "Web Applications   — High-performance Next.js & React cloud systems"}
              </AnimatedSpan>

              <AnimatedSpan className="text-emerald-400">
                ✔ {about?.terminalCapability2 || "Enterprise ERPs    — Scalable workflow engines & operational platforms"}
              </AnimatedSpan>

              <AnimatedSpan className="text-emerald-400">
                ✔ {about?.terminalCapability3 || "Mobile Apps        — Cross-platform iOS & Android apps with fluid UX"}
              </AnimatedSpan>

              <AnimatedSpan className="text-emerald-400">
                ✔ {about?.terminalCapability4 || "Desktop Apps       — Native-grade desktop tools built for stability"}
              </AnimatedSpan>

              <TypingAnimation duration={25}>$ echo $DEV_STATUS</TypingAnimation>

              <AnimatedSpan className="text-amber-400">
                ▲ {about?.terminalStatus || "Available for New High-Impact Engineering Projects"}
              </AnimatedSpan>
            </Terminal>
          </div>

          {/* Bottom Bar: Badges & CTA */}
          <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-[var(--border)]">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--pill-bg)] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[var(--pill-text)]">
                {about?.terminalPill1 || "⚡ Cloud-Native"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--pill-bg)] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[var(--pill-text)]">
                {about?.terminalPill2 || "🔒 Scalable ERP & Systems"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[var(--pill-bg)] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[var(--pill-text)]">
                {about?.terminalPill3 || "🎯 Web • Mobile • Desktop"}
              </span>
            </div>

            <a
              href={about?.terminalCtaUrl || "#contact"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--btn-primary-bg)] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-[var(--btn-primary-text)] shadow-xs transition-all duration-200 hover:bg-[var(--btn-primary-hover)]"
            >
              <span>{about?.terminalCtaText || "Get In Touch"}</span>
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
