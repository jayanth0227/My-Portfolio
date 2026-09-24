"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface SpotlightNavbarProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
}

const DEFAULT_PORTFOLIO_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function SpotlightNavbar({
  items = DEFAULT_PORTFOLIO_ITEMS,
  className,
  onItemClick,
  defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState<number | null>(null);

  // Refs for light positions to animate imperatively
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  // Mouse move spotlight tracking
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    let rect = nav.getBoundingClientRect();
    const updateRect = () => {
      if (nav) rect = nav.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      // Spring spotlight back to active item
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - rect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 220,
          damping: 22,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mouseenter", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);
    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mouseenter", updateRect);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  // Handle ambience indicator movement
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 220,
        damping: 22,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item: NavItem, index: number) => {
    setActiveIndex(index);
    onItemClick?.(item, index);

    // Smooth scroll to section if hash link
    if (item.href.startsWith("#")) {
      const targetId = item.href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={cn("relative flex justify-center", className)}>
      <nav
        ref={navRef}
        className={cn(
          "relative h-11 rounded-full transition-all duration-300 overflow-hidden",
          "border border-neutral-200/80 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]",
          "dark:border-white/10 dark:bg-neutral-900/80 dark:shadow-[0_4px_25px_-4px_rgba(0,0,0,0.4)]",
          "spotlight-nav spotlight-nav-bg glass-border spotlight-nav-shadow"
        )}
      >
        {/* Nav Links */}
        <ul className="relative flex items-center h-full px-2 gap-1 z-[10]">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="relative h-full flex items-center justify-center"
            >
              <a
                href={item.href}
                data-index={idx}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item, idx);
                }}
                className={cn(
                  "px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200 rounded-full select-none cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:focus-visible:ring-yellow-400",
                  activeIndex === idx
                    ? "text-neutral-950 font-semibold dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 1. Moving Spotlight (Follows Mouse with Warm Amber/Gold Glow) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            background: `
              radial-gradient(
                130px circle at var(--spotlight-x, 0px) 100%, 
                var(--spotlight-color, rgba(234, 179, 8, 0.16)) 0%, 
                transparent 60%
              )
            `,
          }}
        />

        {/* 2. Active Ambience Underline (Stays on Active Item with Golden Glow) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2.5px] z-[2]"
          style={{
            background: `
              radial-gradient(
                70px circle at var(--ambience-x, 0px) 0%, 
                var(--ambience-color, rgba(234, 179, 8, 0.95)) 0%, 
                transparent 100%
              )
            `,
          }}
        />
      </nav>

      {/* Styled JSX for Dynamic Theme Accent Colors */}
      <style jsx>{`
        nav {
          /* Warm Amber / Electric Gold Light Mode */
          --spotlight-color: rgba(234, 179, 8, 0.14);
          --ambience-color: rgba(234, 179, 8, 0.95);
        }
        :global(.dark) nav {
          /* Bright Vibrant Gold Dark Mode */
          --spotlight-color: rgba(250, 204, 21, 0.22);
          --ambience-color: rgba(250, 204, 21, 1);
        }
      `}</style>
    </div>
  );
}

export function SpotlightNavbarDemo() {
  return (
    <SpotlightNavbar
      items={[
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Projects", href: "#projects" },
        { label: "Skills", href: "#skills" },
        { label: "Contact", href: "#contact" },
      ]}
    />
  );
}

export default SpotlightNavbar;
