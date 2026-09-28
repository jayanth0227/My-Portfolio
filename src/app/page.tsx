"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechOrbit from "@/components/TechOrbit";
import { GridPattern } from "@/components/ui/grid-pattern";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { Skiper30 } from "@/components/Skiper30";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Minimum display time for the loading screen
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      // Allow fade-out animation to complete before unmounting
      const cleanup = setTimeout(() => setShowLoader(false), 700);
      return () => clearTimeout(cleanup);
    }
  }, [loading]);

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
          className="relative w-full overflow-hidden bg-[var(--background)] flex items-center justify-center pt-16 pb-8 sm:pt-20 sm:pb-10 lg:pt-16 lg:pb-8 scroll-mt-0"
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

        {/* 4th & 5th Section Anchors (Projects & Contact) */}
        <div id="projects" className="scroll-mt-0 pointer-events-none" />
        <div id="contact" className="scroll-mt-0 pointer-events-none" />

        {/* Quick Action: Smooth Scroll to Top Button */}
        <ScrollToTop />
      </main>
    </>
  );
}
