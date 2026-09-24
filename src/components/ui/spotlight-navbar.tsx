"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

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

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

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
    if (item.href.startsWith("#")) {
      const targetEl = document.getElementById(item.href.slice(1));
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      {/* Nav pill */}
      <nav
        ref={navRef}
        className={cn(
          "relative h-11 rounded-full transition-all duration-300 overflow-hidden",
          "border border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md",
          "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_25px_-4px_rgba(0,0,0,0.5)]",
          "spotlight-nav"
        )}
      >
        {/* Nav Links */}
        <ul className="relative flex items-center h-full px-2 gap-1 z-[10]">
          {items.map((item, idx) => (
            <li key={idx} className="relative h-full flex items-center justify-center">
              <a
                href={item.href}
                data-index={idx}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item, idx);
                }}
                className={cn(
                  "px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200 rounded-full select-none cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                  activeIndex === idx
                    ? "text-[var(--foreground)] font-semibold"
                    : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Moving Spotlight (Follows Mouse) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1]"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            transition: "opacity 0.2s",
            background: `radial-gradient(130px circle at var(--spotlight-x, 0px) 100%, rgba(234,179,8,0.15) 0%, transparent 60%)`,
          }}
        />

        {/* Active Ambience Underline */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2.5px] z-[2]"
          style={{
            background: `radial-gradient(70px circle at var(--ambience-x, 0px) 0%, rgba(234,179,8,0.95) 0%, transparent 100%)`,
          }}
        />
      </nav>

      {/* Theme Toggler — sits right of the nav pill */}
      <div className="flex items-center justify-center h-11 w-11 rounded-full border border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_25px_-4px_rgba(0,0,0,0.5)]">
        <AnimatedThemeToggler size={44} />
      </div>
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
