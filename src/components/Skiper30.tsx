"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=75",
];

export interface Skiper30Props {
  images?: string[];
  className?: string;
}

const Skiper30 = ({ images = DEFAULT_IMAGES, className = "" }: Skiper30Props) => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  // Subdued, highly optimized parallax velocities to eliminate GPU stutter
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 0.45]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 0.8]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 0.35]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 0.7]);

  useEffect(() => {
    // Tuned lightweight Lenis configuration for smooth 60fps scrolling without input latency
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
    });

    let animationFrameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    animationFrameId = requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  const imageList = images.length >= 12 ? images : DEFAULT_IMAGES;

  return (
    <section id="projects" className={`relative w-full bg-[#fafafa] text-neutral-900 ${className}`}>
      {/* Intro section with clean spacing */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-16">
        <div className="flex flex-col items-center gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Curated Showcase &amp; Architecture</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            Selected Work &amp; Creations
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 max-w-lg">
            A dynamic visual exploration of cloud applications, interactive user experiences, and distributed infrastructure.
          </p>

          <span className="relative max-w-[14ch] text-xs uppercase tracking-widest text-neutral-400 pt-6 after:absolute after:left-1/2 after:top-full after:h-12 after:w-px after:bg-gradient-to-b after:from-neutral-300 after:to-neutral-900 after:content-['']">
            scroll down to see
          </span>
        </div>
      </div>

      {/* Parallax 4-Column Gallery with Hardware Acceleration */}
      <div
        ref={gallery}
        className="relative box-border flex h-[130vh] gap-[1.8vw] overflow-hidden bg-white p-[2vw]"
      >
        <Column images={[imageList[0], imageList[1], imageList[2]]} y={y} />
        <Column images={[imageList[3], imageList[4], imageList[5]]} y={y2} />
        <Column images={[imageList[6], imageList[7], imageList[8]]} y={y3} />
        <Column images={[imageList[9], imageList[10], imageList[11]]} y={y4} />
      </div>

      {/* Outro spacer */}
      <div className="relative flex items-center justify-center text-center py-20 bg-[#fafafa]">
        <span className="relative max-w-[14ch] text-xs uppercase tracking-widest text-neutral-400 after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:bg-gradient-to-b after:from-neutral-300 after:to-neutral-900 after:content-['']">
          scroll to explore
        </span>
      </div>
    </section>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[25%] flex h-full w-1/4 min-w-[200px] flex-col gap-[1.8vw] first:top-[-25%] [&:nth-child(2)]:top-[-50%] [&:nth-child(3)]:top-[-25%] [&:nth-child(4)]:top-[-40%] will-change-transform transform-gpu"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="relative h-full w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <img
            src={src}
            alt={`Portfolio showcase item ${i + 1}`}
            className="pointer-events-none h-full w-full object-cover select-none"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { Skiper30 };
export default Skiper30;
