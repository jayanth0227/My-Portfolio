"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Track scroll position: scroll direction hide/show & active section spy
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Hide navbar when scrolling down, show when scrolling up or at top
      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 8) {
        // Scrolling DOWN
        setIsVisible(false);
        setMobileMenuOpen(false);
      } else if (lastScrollY.current - currentScrollY > 8) {
        // Scrolling UP
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Section spy
      const sectionIds = items.map((item) => item.href.replace("#", ""));
      const scrollPos = currentScrollY + 220;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleItemClick = (item: NavItem, index: number) => {
    setActiveIndex(index);
    setMobileMenuOpen(false);
    onItemClick?.(item, index);
    if (item.href.startsWith("#")) {
      const targetId = item.href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      } else if (targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : -110,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative w-full", className)}
    >
      {/* Main Wide Navbar Container */}
      <nav
        className={cn(
          "w-full h-16 sm:h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between",
          "rounded-2xl sm:rounded-full transition-all duration-300",
          "bg-[var(--card-bg)]/90 dark:bg-[#0c0c0e]/90 backdrop-blur-2xl",
          "border border-[var(--border)] dark:border-zinc-800/90",
          "shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_45px_-5px_rgba(0,0,0,0.7)]",
          scrolled ? "border-amber-500/25 shadow-amber-500/5 ring-1 ring-amber-500/10" : ""
        )}
      >
        {/* Left Side Edge: Signature "Jayanth Sai Chikkala" in Yellow */}
        <div className="flex items-center shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(items[0], 0);
            }}
            className="group flex items-center gap-1.5 select-none cursor-pointer py-1"
            aria-label="Jayanth Sai Chikkala - Home"
          >
            <span className="font-signature text-2xl sm:text-3xl lg:text-[32px] font-bold text-amber-500 dark:text-amber-400 tracking-wide transition-all duration-200 group-hover:text-amber-400 dark:group-hover:text-amber-300 drop-shadow-xs">
              Jayanth Sai Chikkala
            </span>
          </a>
        </div>

        {/* Center: Navigation Tabs (Desktop & Tablet) */}
        <ul className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-[var(--muted)]/80 dark:bg-zinc-900/80 border border-[var(--border)] dark:border-zinc-800/80 relative">
          {items.map((item, idx) => {
            const isActive = activeIndex === idx;
            const isHovered = hoverIndex === idx;

            return (
              <li
                key={idx}
                className="relative"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item, idx);
                  }}
                  className={cn(
                    "relative z-10 px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 block select-none cursor-pointer",
                    isActive
                      ? "text-[var(--foreground)] font-bold"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"
                  )}
                >
                  {item.label}
                </a>

                {/* Active Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full shadow-xs border border-[var(--border)] dark:border-zinc-700/80 z-0"
                  />
                )}

                {/* Subtle Hover Glow Pill */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute inset-0 bg-amber-500/10 dark:bg-amber-400/10 rounded-full z-0"
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right Side Edge: Theme Toggle & Mobile Menu Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[var(--border)] dark:border-zinc-800/80 bg-[var(--muted)]/60 dark:bg-zinc-900/80 hover:border-amber-500/40 hover:bg-[var(--muted)] dark:hover:bg-zinc-900 transition-colors shadow-xs">
            <AnimatedThemeToggler size={38} />
          </div>

          {/* Mobile Menu Button (Small Screens) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-[var(--border)] dark:border-zinc-800/80 bg-[var(--muted)]/60 dark:bg-zinc-900/80 text-[var(--foreground)] hover:text-amber-500 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 p-3 rounded-2xl bg-[var(--card-bg)]/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-[var(--border)] dark:border-zinc-800/90 shadow-xl space-y-1"
          >
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <a
                  key={idx}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item, idx);
                  }}
                  className={cn(
                    "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] dark:hover:bg-zinc-800/50"
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SpotlightNavbarDemo() {
  return <SpotlightNavbar />;
}

export default SpotlightNavbar;
