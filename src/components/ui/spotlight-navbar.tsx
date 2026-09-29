"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { usePortfolioContent } from "@/context/PortfolioContentContext";

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
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function SpotlightNavbar({
  items = DEFAULT_PORTFOLIO_ITEMS,
  className,
  onItemClick,
  defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
  const { content } = usePortfolioContent();
  const brandName = content.navbar?.brandName || "Jayanth Sai Chikkala";
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const isNavigatingRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Track scroll position: scroll direction hide/show & active section spy
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Do not hide navbar while click navigation is actively smooth scrolling
      if (isNavigatingRef.current) {
        lastScrollY.current = currentScrollY;
        return;
      }

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

      // Monitored sections mapping to navigation tabs in order from top to bottom
      // Section 3 (#skills) & Section 4 (#skills-showcase) both represent the Skills tab (starting at Section 3)
      const sectionTargets: { id: string; targetHref: string }[] = [
        { id: "home", targetHref: "#home" },
        { id: "about", targetHref: "#about" },
        { id: "skills", targetHref: "#skills" },
        { id: "skills-showcase", targetHref: "#skills" },
        { id: "projects", targetHref: "#projects" },
        { id: "experience", targetHref: "#experience" },
        { id: "contact", targetHref: "#contact" },
      ];

      const scrollPos = currentScrollY + 220;

      // Check if user is at the bottom of the page
      const isAtBottom =
        window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 60;

      if (isAtBottom) {
        for (let i = sectionTargets.length - 1; i >= 0; i--) {
          const target = sectionTargets[i];
          const el = document.getElementById(target.id);
          if (el) {
            const itemIdx = items.findIndex((item) => item.href === target.targetHref);
            if (itemIdx !== -1) {
              setActiveIndex(itemIdx);
              break;
            }
          }
        }
      } else {
        for (let i = sectionTargets.length - 1; i >= 0; i--) {
          const target = sectionTargets[i];
          const el = document.getElementById(target.id);
          if (el) {
            const top = el.getBoundingClientRect().top + currentScrollY;
            if (scrollPos >= top) {
              const itemIdx = items.findIndex((item) => item.href === target.targetHref);
              if (itemIdx !== -1) {
                setActiveIndex(itemIdx);
                break;
              }
            }
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

      // Keep navbar visible during user click navigation
      setIsVisible(true);
      isNavigatingRef.current = true;
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      navigationTimeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 900);

      if (targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const targetY = targetEl.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
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
          "w-full h-11 sm:h-12 px-3.5 sm:px-5 lg:px-6 flex items-center justify-between",
          "rounded-2xl sm:rounded-full transition-all duration-300",
          "bg-[var(--card-bg)]/90 dark:bg-[#0c0c0e]/90 backdrop-blur-2xl",
          "border border-amber-400/30 dark:border-amber-500/20",
          "shadow-[0_0_15px_-3px_rgba(234,179,8,0.15),0_0_6px_-1px_rgba(234,179,8,0.1)] dark:shadow-[0_0_20px_-3px_rgba(234,179,8,0.12),0_0_8px_-1px_rgba(234,179,8,0.08)]",
          "ring-1 ring-amber-400/20 dark:ring-amber-500/15",
          scrolled ? "border-amber-400/50 dark:border-amber-500/35 shadow-[0_0_25px_-3px_rgba(234,179,8,0.25),0_0_10px_-1px_rgba(234,179,8,0.15)] dark:shadow-[0_0_30px_-3px_rgba(234,179,8,0.2),0_0_12px_-1px_rgba(234,179,8,0.12)] ring-amber-400/30 dark:ring-amber-500/25" : ""
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
            className="group flex items-center gap-1.5 select-none cursor-pointer py-0.5"
            aria-label="Jayanth Sai Chikkala - Home"
          >
            <span className="font-signature text-xl sm:text-2xl lg:text-[25px] font-bold text-amber-500 dark:text-amber-400 tracking-wide transition-all duration-200 group-hover:text-amber-400 dark:group-hover:text-amber-300 drop-shadow-xs">
              {brandName}
            </span>
          </a>
        </div>

        {/* Center: Navigation Tabs (Desktop & Tablet) */}
        <ul className="hidden md:flex items-center gap-0.5 p-1 rounded-full bg-[var(--muted)]/80 dark:bg-zinc-900/80 border border-[var(--border)] dark:border-zinc-800/80 relative">
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
                    "relative z-10 px-3 py-1 sm:px-3.5 sm:py-1 text-xs font-semibold rounded-full transition-colors duration-200 block select-none cursor-pointer leading-tight",
                    isActive
                      ? "text-zinc-950 dark:text-amber-400 font-bold"
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
                    className="absolute inset-0 bg-white dark:bg-zinc-800/95 rounded-full shadow-xs border border-[var(--border)] dark:border-amber-500/30 dark:shadow-[0_0_12px_rgba(245,158,11,0.15)] z-0"
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
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full border border-[var(--border)] dark:border-zinc-800/80 bg-[var(--muted)]/60 dark:bg-zinc-900/80 hover:border-amber-500/40 hover:bg-[var(--muted)] dark:hover:bg-zinc-900 transition-colors shadow-xs">
            <AnimatedThemeToggler size={28} />
          </div>

          {/* Mobile Menu Button (Small Screens) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full border border-[var(--border)] dark:border-zinc-800/80 bg-[var(--muted)]/60 dark:bg-zinc-900/80 text-[var(--foreground)] hover:text-amber-500 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
