"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import TechOrbit from "@/components/TechOrbit";
import { GridPattern } from "@/components/ui/grid-pattern";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { Skiper30 } from "@/components/Skiper30";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[var(--background)] selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] relative">
      {/* Floating Spotlight Navigation Bar */}
      <header className="fixed top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto">
          <SpotlightNavbar />
        </div>
      </header>

      {/* 1st Section: Hero Section */}
      <Hero />

      {/* 2nd Section: Interactive Box Grid Background with ID Card & About Info */}
      <section
        id="about"
        className="relative min-h-screen lg:h-screen w-full overflow-visible lg:overflow-hidden bg-[var(--background)] flex items-center justify-center pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-14 lg:pb-2 scroll-mt-20 lg:scroll-mt-0"
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

      {/* 2.5 Section: Interactive Java Full Stack Orbiting Circles (Under About) */}
      <TechOrbit />

      {/* 3rd Section: Parallax Showcase Gallery (Skiper 30) */}
      <Skiper30 />
    </main>
  );
}
