"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechOrbit from "@/components/TechOrbit";
import { GridPattern } from "@/components/ui/grid-pattern";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { Skiper30 } from "@/components/Skiper30";
import { StripedPattern } from "@/registry/magicui/striped-pattern";
import Projects from "@/components/Projects";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Only show loading screen once per session on initial visit
    const hasLoaded = sessionStorage.getItem("portfolio_has_loaded");
    if (!hasLoaded) {
      setLoading(true);
      setShowLoader(true);
      sessionStorage.setItem("portfolio_has_loaded", "true");

      const timer = setTimeout(() => setLoading(false), 1600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!loading && showLoader) {
      // Allow fade-out animation to complete before unmounting
      const cleanup = setTimeout(() => setShowLoader(false), 600);
      return () => clearTimeout(cleanup);
    }
  }, [loading, showLoader]);

  return (
    <>
      {showLoader && <LoadingScreen isVisible={loading} />}
      <main
        className="min-h-screen w-full bg-[var(--background)] selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] relative"
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s ease-in 0.2s",
        }}
      >
        {/* Top Floating Navigation Bar */}
        <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl pointer-events-auto">
            <SpotlightNavbar />
          </div>
        </header>

        {/* 1st Section: Hero Section */}
        <Hero />

        {/* 2nd Section: Interactive Box Grid Background with ID Card & About Info */}
        <section
          id="about"
          className="relative w-full overflow-hidden bg-[var(--background)] flex items-center justify-center pt-8 pb-4 sm:pt-10 sm:pb-6 lg:pt-8 lg:pb-6 scroll-mt-0"
        >
          {/* Interactive Dash Grid Layer */}
          <GridPattern
            width={40}
            height={40}
            strokeDasharray="4 2"
          />

          {/* Foreground Content */}
          <About />
        </section>

        {/* 3rd Section: Skills (Part 1 - Interactive Java & MERN Ecosystem Tech Orbit) */}
        <TechOrbit />

        {/* 4th Section: Skills (Part 2 - Parallax Showcase Gallery of 30 Skills) */}
        <Skiper30 />

        {/* 5th & 6th Section: Unified Projects & Work Experience Section with Continuous Striped Pattern */}
        <section
          className="relative w-full overflow-hidden bg-[var(--background)] selection:bg-amber-500/20 selection:text-amber-600 dark:selection:text-amber-400"
        >
          {/* Continuous Interactive Striped Pattern Canvas spanning both Projects & Experience */}
          <StripedPattern
            spacing={38}
            strokeDasharray="4 2"
          />

          {/* Continuous Luminous Ambient Glowing Background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
            <div className="absolute top-[6%] left-1/2 -translate-x-1/2 h-[650px] w-[900px] rounded-full bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl opacity-75 dark:opacity-30" />
            <div className="absolute top-[45%] right-[4%] h-[550px] w-[550px] rounded-full bg-amber-500/5 blur-3xl" />
            <div className="absolute bottom-[5%] left-[4%] h-[600px] w-[700px] rounded-full bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl opacity-60 dark:opacity-25" />
          </div>

          {/* Projects Anchor & Content */}
          <div id="projects" className="scroll-mt-20" />
          <Projects />

          {/* Subtle Seamless Dividing Accent between Projects & Experience */}
          <div className="relative z-10 max-w-5xl mx-auto my-4 sm:my-8 px-6">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/20 dark:via-amber-400/15 to-transparent" />
          </div>

          {/* Experience Timeline Anchor & Content */}
          <div id="experience" className="scroll-mt-20" />
          <ExperienceTimeline />
        </section>

        {/* 7th Section Anchor (Contact) */}
        <div id="contact" className="scroll-mt-0 pointer-events-none" />

        {/* Quick Action: Smooth Scroll to Top Button */}
        <ScrollToTop />

        {/* Dynamic Magnetic Cursor System */}
        <MagneticCursor />
      </main>
    </>
  );
}
