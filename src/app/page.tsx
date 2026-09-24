import Hero from "@/components/Hero";
import { GridPattern } from "@/components/ui/grid-pattern";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white selection:bg-yellow-200 selection:text-neutral-900">
      {/* Hero Section */}
      <Hero />

      {/* Full-Screen Interactive Grid Background Section */}
      <section className="relative h-screen w-full overflow-hidden bg-white">
        <GridPattern
          width={30}
          height={30}
          strokeDasharray="4 2"
        />
      </section>
    </main>
  );
}
