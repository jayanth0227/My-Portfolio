import Hero from "@/components/Hero";
import { GridPattern } from "@/components/ui/grid-pattern";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { Skiper30 } from "@/components/Skiper30";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white selection:bg-yellow-200 selection:text-neutral-900 relative">
      {/* Floating Spotlight Navigation Bar */}
      <header className="fixed top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto">
          <SpotlightNavbar />
        </div>
      </header>

      {/* 1st Section: Hero Section */}
      <Hero />

      {/* 2nd Section: Full-Screen Interactive Box Grid Background */}
      <section id="about" className="relative h-screen w-full overflow-hidden bg-white">
        <GridPattern
          width={30}
          height={30}
          strokeDasharray="4 2"
        />
      </section>

      {/* 3rd Section: Parallax Showcase Gallery (Skiper 30) */}
      <Skiper30 />
    </main>
  );
}
