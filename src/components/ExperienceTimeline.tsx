"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Briefcase,
  Calendar,
  Building2,
  MapPin,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { usePortfolioContent } from "@/context/PortfolioContentContext";
import { ExperienceItem } from "@/lib/contentDefaults";
import { Magnetic } from "@/components/ui/magnetic";

// Interactive 3D Tilt Parallax Card Item
function TimelineCard({
  item,
  index,
  total,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  // Individual scroll parallax for this specific card
  const { scrollYProgress: cardScrollProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Parallax subtle vertical movement & scale (tightened to prevent large gaps)
  const cardY = useTransform(
    cardScrollProgress,
    [0, 0.5, 1],
    [isEven ? 12 : 18, 0, isEven ? -12 : -18]
  );
  const smoothCardY = useSpring(cardY, { stiffness: 300, damping: 35 });

  const cardOpacity = useTransform(
    cardScrollProgress,
    [0, 0.25, 0.85, 1],
    [0.4, 1, 1, 0.5]
  );

  const nodeScale = useTransform(
    cardScrollProgress,
    [0.2, 0.5, 0.8],
    [0.85, 1.15, 0.9]
  );
  const smoothNodeScale = useSpring(nodeScale, { stiffness: 400, damping: 30 });

  // 3D Mouse Parallax Hover Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 350,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 350,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Parse description bullet points or line breaks
  const descriptionBullets = item.description
    ? item.description
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col sm:flex-row items-start ${
        isEven ? "sm:flex-row-reverse" : ""
      } group`}
    >
      {/* Glowing Timeline Marker Node with Parallax Scaling */}
      <motion.div
        style={{ scale: smoothNodeScale }}
        className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-1.5 sm:top-8 z-20 flex items-center justify-center pointer-events-none"
      >
        <div className="relative flex items-center justify-center">
          {/* Ambient outer pulse halo */}
          <div className="absolute h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-amber-500/25 dark:bg-amber-400/20 animate-ping opacity-60" />
          <div className="absolute h-12 w-12 rounded-full bg-amber-500/10 dark:bg-amber-400/10 blur-md" />

          {/* Core Node Button */}
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[var(--card-bg)] border-2 border-amber-500 dark:border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.5)] flex items-center justify-center text-amber-500 dark:text-amber-400 transition-transform duration-300">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
      </motion.div>

      {/* Content Card Container with Parallax Translation & 3D Perspective */}
      <motion.div
        style={{ y: smoothCardY, opacity: cardOpacity }}
        className={`w-full sm:w-[calc(50%-2.25rem)] pl-12 sm:pl-0 ${
          isEven ? "sm:pl-10" : "sm:pr-10"
        } perspective-1000`}
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          className="timeline-interactive-card rounded-2xl sm:rounded-3xl border border-amber-400/35 dark:border-amber-500/25 bg-[var(--card-bg)]/95 backdrop-blur-md p-5 sm:p-7 shadow-lg shadow-amber-500/5 hover:shadow-2xl hover:shadow-amber-500/15 hover:border-amber-400/60 dark:hover:border-amber-400/40 transition-all duration-300 relative overflow-hidden group/card cursor-default"
        >
          {/* Dynamic Radial Spotlight on Mouse Move */}
          {isHovered && (
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(400px circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(245, 158, 11, 0.12), transparent 70%)`,
              }}
            />
          )}

          {/* Terminal Header Bar with Window Controls */}
          <div className="flex items-center justify-between border-b border-[var(--border)] dark:border-zinc-800/80 pb-3.5 mb-4 relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff605c]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd44]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#00ca4e]" />
              <span className="ml-2 text-[11px] font-mono text-[var(--muted-fg)]">
                exp_0{index + 1}.log
              </span>
            </div>

            {/* Period / Date Badge with Magnetic Pull */}
            <Magnetic strength={0.2}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold shadow-xs">
                <Calendar className="h-3 w-3" />
                <span>{item.period}</span>
              </div>
            </Magnetic>
          </div>

          {/* Role Title */}
          <div className="space-y-2 relative z-10">
            <h3 className="text-lg sm:text-xl font-extrabold text-[var(--foreground)] tracking-tight group-hover/card:text-amber-500 dark:group-hover/card:text-amber-400 transition-colors flex items-center gap-2">
              <span>{item.role}</span>
            </h3>

            {/* Company and Location Meta */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--muted-fg)]">
              <div className="inline-flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                <Building2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{item.title}</span>
              </div>

              {item.location && (
                <div className="inline-flex items-center gap-1 text-xs text-[var(--muted-fg)] border-l border-[var(--border)] pl-2.5">
                  <MapPin className="h-3 w-3 text-amber-500 shrink-0" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-4 pt-3.5 border-t border-[var(--border)]/60 text-xs sm:text-sm text-[var(--muted-fg)] leading-relaxed space-y-2.5 relative z-10">
            {descriptionBullets.length > 1 ? (
              <ul className="space-y-2">
                {descriptionBullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{bullet.replace(/^[-•*]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {/* Card Glow Corner Accent */}
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover/card:bg-amber-500/15 transition-colors" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ExperienceTimeline() {
  const { content } = usePortfolioContent();
  const rawExperience = content.experience || [];

  const sectionRef = useRef<HTMLDivElement>(null);

  // Overall Section Scroll Progress for Parallax Background & Connecting Beam
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
  });

  // Dynamic Parallax Floating Background Offsets
  const bgOrb1Y = useTransform(smoothProgress, [0, 1], [-100, 120]);
  const bgOrb2Y = useTransform(smoothProgress, [0, 1], [80, -100]);
  const bgSymbolRotate1 = useTransform(smoothProgress, [0, 1], [-15, 30]);
  const bgSymbolRotate2 = useTransform(smoothProgress, [0, 1], [25, -25]);
  const bgTextY = useTransform(smoothProgress, [0, 1], [-50, 60]);

  // Dynamic Beam Tracing Height for Central Line
  const beamScaleY = useTransform(smoothProgress, [0.15, 0.85], [0, 1]);
  const smoothBeamScale = useSpring(beamScaleY, { stiffness: 400, damping: 45 });

  // Sort experience items by order ascending
  const experienceList: ExperienceItem[] = [...rawExperience].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <div
      ref={sectionRef}
      className="relative z-10 w-full pt-2 pb-12 sm:pt-4 sm:pb-16 lg:pt-4 lg:pb-16"
    >

      {/* Parallax Floating Background Glows & Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Luminous Glow Blob 1 */}
        <motion.div
          style={{ y: bgOrb1Y }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[550px] w-[750px] rounded-full bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl opacity-70 dark:opacity-30"
        />

        {/* Luminous Glow Blob 2 */}
        <motion.div
          style={{ y: bgOrb2Y }}
          className="absolute bottom-10 right-10 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-3xl"
        />

        {/* Parallax Floating Code Watermark 1 */}
        <motion.div
          style={{ y: bgOrb1Y, rotate: bgSymbolRotate1 }}
          className="absolute top-24 left-[8%] text-7xl sm:text-9xl font-mono font-black text-amber-500/[0.03] dark:text-amber-400/[0.04] hidden md:block"
        >
          {"<Experience />"}
        </motion.div>

        {/* Parallax Floating Code Watermark 2 */}
        <motion.div
          style={{ y: bgOrb2Y, rotate: bgSymbolRotate2 }}
          className="absolute bottom-28 right-[6%] text-8xl sm:text-[140px] font-mono font-black text-amber-500/[0.03] dark:text-amber-400/[0.04] hidden md:block"
        >
          {"{ ...timeline }"}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Parallax Float (tightened spacing) */}
        <motion.div
          style={{ y: bgTextY }}
          className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-2.5 mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Magnetic strength={0.25}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold tracking-wide shadow-xs cursor-pointer hover:border-amber-500/40 transition-colors">
                <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
                <span>Career Journey</span>
              </div>
            </Magnetic>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--foreground)]"
          >
            Work{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500">
              Experience
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-[var(--muted-fg)] leading-relaxed"
          >
            A chronological timeline of my professional work experience, engineering roles, and technical contributions across scalable digital systems.
          </motion.p>
        </motion.div>

        {/* Vertical Timeline Structure */}
        {experienceList.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--border)] text-[var(--muted-fg)] bg-[var(--card-bg)]/40">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-40 text-amber-500" />
            <p className="text-base font-semibold text-[var(--foreground)]">No experience entries found.</p>
            <p className="text-xs sm:text-sm text-[var(--muted-fg)] mt-1">
              Add experience items from the Admin Dashboard to showcase your career journey.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Base Vertical Connector Track (Dimmed) */}
            <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-amber-500/15 dark:bg-amber-400/10 rounded-full" />

            {/* Dynamic Parallax Tracing Beam (Active Neon Line) */}
            <motion.div
              style={{
                scaleY: smoothBeamScale,
                originY: 0,
              }}
              className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.6)] rounded-full z-10"
            />

            {/* Timeline Item Nodes with Individual Scroll Parallax */}
            <div className="space-y-8 sm:space-y-10">
              {experienceList.map((item, idx) => (
                <TimelineCard
                  key={item.id || (item as unknown as { _id?: string })._id || idx}
                  item={item}
                  index={idx}
                  total={experienceList.length}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExperienceTimeline;
