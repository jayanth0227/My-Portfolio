"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Clock,
  ArrowUpRight,
  Heart,
  User,
} from "lucide-react";
import { Iphone } from "@/registry/magicui/iphone";
import { Folder } from "@/components/ui/Folder";
import { usePortfolioContent } from "@/context/PortfolioContentContext";
import { DEFAULT_PORTFOLIO_CONTENT } from "@/lib/contentDefaults";
import { cn } from "@/lib/utils";

import Dock, { type DockItem } from "@/components/smoothui/components/dock";
import {
  WhatsAppAppIcon,
  GmailAppIcon,
  LinkedInAppIcon,
  InstagramAppIcon,
} from "@/components/ui/app-icons";

// Custom SVG Icons for LinkedIn and GitHub
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "h-4 w-4"}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "h-4 w-4"}
    >
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

const QUICK_PROMPTS = [
  "🚀 Discuss a new project",
  "💼 Full-time job opportunity",
  "☕ Coffee & tech chat",
  "⚡ Backend / Spring Boot consultation",
];

export default function Contact() {
  const { content } = usePortfolioContent();
  const contact = content.contact || DEFAULT_PORTFOLIO_CONTENT.contact;
  const hero = content.hero;
  const about = content.about;
  const navbar = content.navbar;

  const fullName = contact.dossierName || about.fullName || "Jayanth Sai Chikkala";
  const designation = contact.dossierRole || about.designation || "Associate Software Engineer";
  const emailAddress = contact.email || "chikkalajayanthsai@gmail.com";
  const phoneNumber = contact.phone || about.mobile || "+91 9010253076";
  const locationText = contact.location || "Hyderabad, India • Remote / Hybrid";
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
  const linkedinUrl =
    contact.linkedinUrl || about.linkedinUrl || "https://www.linkedin.com/in/jayanth-sai-chikkala/";
  const githubUrl = contact.githubUrl || "https://github.com/jayanthsaichikkala";
  const instagramUrl = contact.instagramUrl || "https://www.instagram.com/";
  const whatsappMessage = contact.whatsappMessage || "Hi Jayanth, I saw your portfolio!";
  const resumeUrl = "/api/resume";
  const contactAvatar = contact.avatarUrl || hero.avatarUrl || "/profile.png";
  const quickPrompts = contact.quickPrompts && contact.quickPrompts.length > 0 ? contact.quickPrompts : QUICK_PROMPTS;

  // Copied states for buttons
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleCopy = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // Contacts Dock Navigation items
  const dockItems: DockItem[] = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <WhatsAppAppIcon />,
      href: `https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(whatsappMessage)}`,
      target: "_blank",
      active: true,
    },
    {
      id: "gmail",
      label: "Gmail",
      icon: <GmailAppIcon />,
      href: `mailto:${emailAddress}?subject=${encodeURIComponent("Project / Opportunity Inquiry")}`,
      active: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: <LinkedInAppIcon />,
      href: linkedinUrl,
      target: "_blank",
      active: false,
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: <InstagramAppIcon />,
      href: instagramUrl,
      target: "_blank",
      active: false,
    },
  ];

  return (
    <section
      id="contact"
      className="relative z-10 w-full pt-6 pb-16 sm:pt-8 sm:pb-20 lg:pt-10 lg:pb-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 h-[450px] w-[750px] rounded-full bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl opacity-80 dark:opacity-30" />
        <div className="absolute bottom-[10%] left-[5%] h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute top-[40%] right-[5%] h-[350px] w-[450px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3 shadow-xs backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span>{contact.badgeText || "GET IN TOUCH"}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)]"
          >
            {(contact.titleLine1 || "Let's Build Something")}{" "}
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent">
              {contact.titleLine2 || "Extraordinary"}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-[var(--muted-fg)] leading-relaxed max-w-2xl mx-auto"
          >
            {contact.description ||
              "Have an upcoming project, freelance inquiry, engineering role, or want to explore scalable architectures? Explore the interactive dossier on mobile or reach out directly."}
          </motion.p>
        </div>

        {/* Main Grid: LEFT Phone Component + RIGHT Contact Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT Column: MagicUI iPhone with Animated Irregular Oval Portrait, Folder & Dock Bottom Nav (Span 5) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative order-1"
          >
            {/* Ambient Soft Glow behind Phone */}
            <div className="absolute -inset-2 rounded-[52px] bg-gradient-to-tr from-[#5227FF]/20 via-amber-500/15 to-purple-600/15 blur-2xl pointer-events-none" />

            {/* Device Wrapper: Clean Rounded Mobile Frame */}
            <div className="relative w-full max-w-[280px] sm:max-w-[295px] md:max-w-[310px] flex items-center justify-center">
              {/* MagicUI iPhone Component with Smooth Rounded Dropshadow */}
              <Iphone className="w-full drop-shadow-[0_18px_38px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
                {/* ── Screen UI Content: Native iOS Experience with Status Bar, Dossier & Dock Bottom Nav ── */}
                <div className="relative h-full w-full bg-gradient-to-b from-[#f1f5f9] via-[#f8fafc] to-[#e2e8f0] dark:from-[#2a263d] dark:via-[#1c192c] dark:to-[#12101e] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-between px-2.5 pt-7 pb-2 select-none overflow-hidden">
                  
                  {/* Glowing Ambient Mesh Behind Elements */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-[#5227FF]/15 dark:bg-[#5227FF]/25 blur-2xl pointer-events-none" />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-amber-500/15 dark:bg-amber-400/15 blur-2xl pointer-events-none" />

                  {/* Subtle Grid Accent Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                      backgroundSize: "14px 14px",
                    }}
                  />

                  {/* Top iOS Status Bar */}
                  <div className="relative z-10 w-full flex items-center justify-between px-3 text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight opacity-90 shrink-0">
                    <span className="tabular-nums">9:41</span>
                    <div className="flex items-center gap-1.5">
                      {/* Signal Bars */}
                      <div className="flex items-end gap-[1.5px] h-2.5">
                        <span className="w-[2px] h-[3px] bg-current rounded-[0.5px]" />
                        <span className="w-[2px] h-[5px] bg-current rounded-[0.5px]" />
                        <span className="w-[2px] h-[7px] bg-current rounded-[0.5px]" />
                        <span className="w-[2px] h-[9px] bg-current rounded-[0.5px]" />
                      </div>
                      {/* 5G */}
                      <span className="text-[9px] font-bold">5G</span>
                      {/* Battery */}
                      <div className="relative w-4 h-2.5 rounded-[3px] border border-current p-[1px] flex items-center">
                        <div className="h-full w-2.5 bg-current rounded-[1.5px]" />
                        <span className="absolute -right-[2.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-1 bg-current rounded-r-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Centered Cohesive Container: Image UP, Folder DOWN */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto gap-2">
                    
                    {/* UP: Animated Irregular Oval Portrait */}
                    <div className="relative flex items-center justify-center p-1.5">
                      {/* Rotating Animated Organic Dash Ring */}
                      <motion.svg
                        viewBox="0 0 160 160"
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      >
                        <defs>
                          <linearGradient id="ovalGradientContact" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5227FF" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#818cf8" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 80,10 C 122,8 148,32 144,78 C 140,124 116,148 76,144 C 36,140 12,118 16,74 C 20,30 38,12 80,10 Z"
                          fill="none"
                          stroke="url(#ovalGradientContact)"
                          strokeWidth="2.2"
                          strokeDasharray="6 4"
                          opacity="0.9"
                        />
                      </motion.svg>

                      {/* Counter-rotating ring removed for performance */}

                      {/* Organic Oval Cutout Container for Portrait */}
                      <motion.div
                        animate={{
                          borderRadius: [
                            "60% 40% 65% 35% / 40% 60% 40% 60%",
                            "45% 55% 40% 60% / 55% 45% 60% 40%",
                            "55% 45% 60% 40% / 45% 55% 42% 58%",
                            "60% 40% 65% 35% / 40% 60% 40% 60%",
                          ],
                        }}
                        transition={{
                          duration: 12,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative overflow-hidden w-[80px] h-[80px] sm:w-[86px] sm:h-[86px] flex items-end justify-center bg-gradient-to-tr from-[#3b335c] via-[#201c34] to-[#4c3f76] border border-amber-400/40 shadow-lg"
                      >
                        <Image
                          src={contactAvatar}
                          alt="Portrait"
                          width={180}
                          height={180}
                          priority
                          className="h-[105%] w-auto object-contain object-bottom select-none pointer-events-none drop-shadow-md"
                        />
                      </motion.div>
                    </div>

                    {/* DOWN: Interactive Folder Component (Directly Below Image) */}
                    <div className="relative flex flex-col items-center justify-center">
                      <Folder
                        size={0.92}
                        color="#5227FF"
                        className="custom-folder"
                        items={[
                          // Paper 1: Direct Email Card
                          <a
                            key="email"
                            href={`mailto:${emailAddress}`}
                            className="h-full w-full p-1.5 flex flex-col justify-between text-left text-zinc-900 font-sans block select-none"
                          >
                            <div className="flex items-center justify-between">
                              <Mail className="h-3 w-3 text-[#5227FF]" />
                              <span className="text-[6px] font-extrabold px-1 py-0.5 rounded bg-indigo-100 text-indigo-800 leading-none">
                                EMAIL
                              </span>
                            </div>
                            <div className="leading-tight">
                              <p className="text-[7px] font-black text-zinc-900 truncate">Direct Mail</p>
                              <p className="text-[5.5px] text-zinc-600 font-mono truncate">{emailAddress}</p>
                            </div>
                          </a>,

                          // Paper 2: WhatsApp / Call Card
                          <a
                            key="phone"
                            href={`tel:${cleanPhone}`}
                            className="h-full w-full p-1.5 flex flex-col justify-between text-left text-zinc-900 font-sans block select-none"
                          >
                            <div className="flex items-center justify-between">
                              <Phone className="h-3 w-3 text-emerald-600" />
                              <span className="text-[6px] font-extrabold px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 leading-none">
                                CALL
                              </span>
                            </div>
                            <div className="leading-tight">
                              <p className="text-[7px] font-black text-zinc-900 truncate">Phone &amp; Chat</p>
                              <p className="text-[5.5px] text-zinc-600 font-mono truncate">{phoneNumber}</p>
                            </div>
                          </a>,

                          // Paper 3: Resume / Profile Card
                          <a
                            key="profile"
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-full w-full p-1.5 flex flex-col justify-between text-left text-zinc-900 font-sans block select-none"
                          >
                            <div className="flex items-center justify-between">
                              <User className="h-3 w-3 text-amber-600" />
                              <span className="text-[6px] font-extrabold px-1 py-0.5 rounded bg-amber-100 text-amber-800 leading-none">
                                RESUME
                              </span>
                            </div>
                            <div className="leading-tight">
                              <p className="text-[7px] font-black text-zinc-900 truncate">{fullName}</p>
                              <p className="text-[5.5px] text-zinc-600 truncate">{designation}</p>
                            </div>
                          </a>,
                        ]}
                      />

                      {/* Subtle Tap Hint right below folder */}
                      <div className="mt-1.5 flex items-center justify-center pointer-events-none">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-md border border-zinc-300/60 dark:border-white/10 text-[7.5px] font-medium text-zinc-700 dark:text-zinc-300 shadow-2xs">
                          <Sparkles className="h-2 w-2 text-[#5227FF] dark:text-amber-400 animate-pulse" />
                          <span>Click folder to open</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: Modern Dock Component as Bottom Nav Bar */}
                  <div className="relative z-20 w-full flex flex-col items-center justify-center shrink-0 pt-1 pb-1">
                    <Dock
                      baseSize={50}
                      distance={90}
                      gap={16}
                      magnification={1.16}
                      reserveSpace={false}
                      className="p-0 w-full flex justify-center"
                      panelClassName="bg-white/85 dark:bg-zinc-900/90 border border-white/60 dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-2xl rounded-[24px]"
                      items={dockItems}
                    />
                  </div>

                  {/* iOS Home Bottom Bar Indicator */}
                  <div className="w-full flex justify-center pb-1 select-none pointer-events-none shrink-0">
                    <div className="h-1 w-28 rounded-full bg-zinc-400/80 dark:bg-zinc-500/80" />
                  </div>
                </div>
              </Iphone>
            </div>
          </motion.div>

          {/* RIGHT Column: Contact Cards & Details (Span 7) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col gap-5 order-2"
          >
            {/* Quick Status Pill */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[var(--card-bg)]/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-[var(--border)] dark:border-zinc-800/80 shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                  {contact.statusLabel || "Current Status"}
                </p>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {contact.statusText || "Available for Full-time Roles & High-Impact Projects"}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--muted)] text-[11px] font-medium text-[var(--muted-fg)]">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>{contact.responseTime || "Avg. response < 2h"}</span>
              </div>
            </div>

            {/* Direct Contact Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Card */}
              <div className="group relative overflow-hidden rounded-2xl p-5 bg-[var(--card-bg)]/90 dark:bg-zinc-900/70 backdrop-blur-sm border border-[var(--border)] dark:border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-amber-500/10">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(emailAddress, "email")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--muted)] hover:bg-amber-500/10 hover:text-amber-500 transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium text-[var(--muted-fg)]">Direct Email</p>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="text-sm sm:text-base font-semibold text-[var(--foreground)] hover:text-amber-500 transition-colors block truncate mt-0.5"
                  >
                    {emailAddress}
                  </a>
                </div>
                <a
                  href={`mailto:${emailAddress}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:underline"
                >
                  <span>Compose Mail</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Phone / WhatsApp Card */}
              <div className="group relative overflow-hidden rounded-2xl p-5 bg-[var(--card-bg)]/90 dark:bg-zinc-900/70 backdrop-blur-sm border border-[var(--border)] dark:border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-amber-500/10">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(phoneNumber, "phone")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--muted)] hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium text-[var(--muted-fg)]">Phone &amp; WhatsApp</p>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-sm sm:text-base font-semibold text-[var(--foreground)] hover:text-emerald-500 transition-colors block truncate mt-0.5"
                  >
                    {phoneNumber}
                  </a>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Direct Call</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                  <span className="text-zinc-400">•</span>
                  <a
                    href={`https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>WhatsApp</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Location & Social Connections Box */}
            <div className="rounded-2xl p-6 bg-[var(--card-bg)]/90 dark:bg-zinc-900/70 backdrop-blur-sm border border-[var(--border)] dark:border-zinc-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--muted-fg)]">Location &amp; Work Mode</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {locationText}
                  </p>
                </div>
              </div>

              {/* Social Link Badges with custom SVGs */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[#0077B5] hover:text-white hover:border-transparent transition-all duration-200 hover:scale-105"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedInIcon className="h-4.5 w-4.5" />
                </a>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-zinc-950 dark:hover:bg-zinc-800 hover:text-white hover:border-transparent transition-all duration-200 hover:scale-105"
                  aria-label="GitHub Profile"
                >
                  <GitHubIcon className="h-4.5 w-4.5" />
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all duration-200 hover:scale-105"
                >
                  <span>Resume</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Discussion Starters */}
            <div className="rounded-2xl p-5 bg-[var(--card-bg)]/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-[var(--border)] dark:border-zinc-800/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-fg)] mb-2.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Quick Discussion Topics</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      const firstName = fullName.split(" ")[0] || "Jayanth";
                      const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
                        prompt.replace(/^[^\s]+\s/, "")
                      )}&body=${encodeURIComponent("Hi " + firstName + ",\n\nI would like to discuss " + prompt)}`;
                      window.location.href = mailtoUrl;
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 text-left cursor-pointer",
                      selectedPrompt === prompt
                        ? "bg-amber-500 text-zinc-950 font-semibold shadow-xs"
                        : "bg-[var(--muted)] text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-amber-500/10"
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
