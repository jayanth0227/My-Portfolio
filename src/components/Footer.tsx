"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  Sparkles,
  Clock,
  ArrowUpRight,
  Heart,
  Terminal,
  Radio,
} from "lucide-react";
import { usePortfolioContent } from "@/context/PortfolioContentContext";
import { Magnetic } from "@/components/ui/magnetic";

// Custom SVG Icons
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "h-4 w-4"}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34 1 2.51c.12.16 1.7 2.6 4.12 3.64.58.25 1.02.4 1.38.52.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28-.25-.12-1.44-.71-1.66-.8-.22-.08-.38-.12-.55.12-.16.25-.64.8-.78.96-.15.17-.3.19-.55.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.43s-.55-1.33-.76-1.82c-.2-.48-.41-.42-.56-.43l-.48-.01z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "h-4 w-4"}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

export default function Footer() {
  const { content } = usePortfolioContent();
  const navbar = content.navbar;
  const about = content.about;
  const contact = content.contact;

  const brandName = contact?.dossierName || navbar?.brandName || "Jayanth Sai Chikkala";
  const roleTitle = contact?.dossierRole || about?.designation || "Associate Software Engineer";
  const emailAddress = contact?.email || "chikkalajayanthsai@gmail.com";
  const phoneNumber = contact?.phone || about?.mobile || "+91 9010253076";
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
  const linkedinUrl =
    contact?.linkedinUrl || about?.linkedinUrl || "https://www.linkedin.com/in/jayanth-sai-chikkala/";
  const githubUrl = contact?.githubUrl || "https://github.com/jayanthsaichikkala";
  const instagramUrl = contact?.instagramUrl || "https://www.instagram.com/";
  const whatsappMessage = contact?.whatsappMessage || "Hi Jayanth, I saw your portfolio!";
  const locationText = contact?.location || "Hyderabad, Telangana, India • Remote / Hybrid";
  const currentYear = new Date().getFullYear();

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About Me", href: "#about" },
    { label: "Tech Ecosystem", href: "#skills" },
    { label: "Featured Projects", href: "#projects" },
    { label: "Career Journey", href: "#experience" },
    { label: "Contact Dossier", href: "#contact" },
  ];

  return (
    <footer className="relative z-20 w-full bg-[var(--background)] border-t border-[var(--border)] dark:border-zinc-800/80 pt-10 pb-8 sm:pt-12 sm:pb-10 lg:pt-14 lg:pb-12 text-[var(--foreground)] selection:bg-amber-500/20 selection:text-amber-600 dark:selection:text-amber-400">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── 3-Column Clean Directory Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 sm:pb-12 border-b border-[var(--border)] dark:border-zinc-800/80">
          
          {/* Col 1: Brand & Profile Description (Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <Link href="#home" className="inline-block group">
                <span className="font-signature text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                  {brandName}
                </span>
              </Link>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-amber-500" />
                <span>{roleTitle}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[var(--muted-fg)] leading-relaxed max-w-md">
              Specialized in enterprise Java, Spring Boot microservices, high-performance React and Next.js applications, and distributed cloud computing with clean architecture.
            </p>

            {/* Social Connection Pills with Magnetic Hover */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-[var(--muted-fg)] uppercase tracking-wider mb-2.5">
                Connect Across Networks
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Magnetic strength={0.25}>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--card-bg)]/90 dark:bg-zinc-900/80 border border-[var(--border)] dark:border-zinc-800 text-[var(--foreground)] hover:bg-[#0077B5] hover:text-white hover:border-transparent transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                  </a>
                </Magnetic>

                <Magnetic strength={0.25}>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--card-bg)]/90 dark:bg-zinc-900/80 border border-[var(--border)] dark:border-zinc-800 text-[var(--foreground)] hover:bg-zinc-950 dark:hover:bg-zinc-800 hover:text-white hover:border-transparent transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="GitHub Profile"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                </Magnetic>

                <Magnetic strength={0.25}>
                  <a
                    href={`https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--card-bg)]/90 dark:bg-zinc-900/80 border border-[var(--border)] dark:border-zinc-800 text-[var(--foreground)] hover:bg-[#25D366] hover:text-white hover:border-transparent transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                </Magnetic>

                <Magnetic strength={0.25}>
                  <a
                    href={`mailto:${emailAddress}?subject=${encodeURIComponent("Project / Opportunity Inquiry")}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--card-bg)]/90 dark:bg-zinc-900/80 border border-[var(--border)] dark:border-zinc-800 text-[var(--foreground)] hover:bg-[#EA4335] hover:text-white hover:border-transparent transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="Send Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </Magnetic>

                <Magnetic strength={0.25}>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--card-bg)]/90 dark:bg-zinc-900/80 border border-[var(--border)] dark:border-zinc-800 text-[var(--foreground)] hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-200 hover:scale-110 shadow-xs"
                    aria-label="Instagram Profile"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (Span 3) */}
          <div className="lg:col-span-3 lg:pl-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Navigation</span>
            </h4>

            <ul className="space-y-2.5 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[var(--muted-fg)] hover:text-amber-500 dark:hover:text-amber-400 transition-colors py-0.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500/40 group-hover:w-3 group-hover:bg-amber-500 transition-all duration-200" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Connect & Office Info (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>Direct Connect</span>
            </h4>

            <div className="space-y-3 text-xs">
              {/* Email Card with Quick Copy */}
              <div className="rounded-2xl p-3.5 bg-[var(--card-bg)]/90 dark:bg-zinc-900/70 backdrop-blur-sm border border-[var(--border)] dark:border-zinc-800/80 shadow-xs hover:border-amber-500/40 transition-all space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[var(--muted-fg)] flex items-center gap-1">
                    <Mail className="h-3 w-3 text-amber-500" />
                    Email
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-2.5 w-2.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-2.5 w-2.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${emailAddress}`}
                  className="block font-semibold text-[var(--foreground)] hover:text-amber-500 transition-colors truncate"
                >
                  {emailAddress}
                </a>
              </div>

              {/* Phone / WhatsApp Card */}
              <div className="rounded-2xl p-3.5 bg-[var(--card-bg)]/90 dark:bg-zinc-900/70 backdrop-blur-sm border border-[var(--border)] dark:border-zinc-800/80 shadow-xs hover:border-amber-500/40 transition-all space-y-1.5">
                <span className="text-[11px] font-medium text-[var(--muted-fg)] flex items-center gap-1">
                  <Phone className="h-3 w-3 text-amber-500" />
                  Direct Phone &amp; WhatsApp
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--foreground)]">{phoneNumber}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <span>Call</span>
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    </a>
                    <span className="text-zinc-400 text-[10px]">•</span>
                    <a
                      href={`https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <span>WhatsApp</span>
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Location & Timezone Details */}
              <div className="flex items-start gap-2 text-[var(--muted-fg)] pt-1">
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{locationText}</span>
              </div>

              <div className="flex items-center gap-2 text-[var(--muted-fg)]">
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>IST (UTC +5:30) • 09:00 - 19:00 Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Sub-Footer Bar ── */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-fg)]">
          {/* Left: Copyright */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>&copy; {currentYear}</span>
            <span className="font-semibold text-[var(--foreground)]">{brandName}</span>
            <span>• All rights reserved.</span>
          </div>

          {/* Right: Heart Badge */}
          <div className="flex items-center gap-1.5 text-center sm:text-right">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>&amp; Engineering Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
