"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-[0_6px_25px_rgba(245,158,11,0.45)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.65)] border border-amber-300/60 dark:border-amber-400/50 cursor-pointer select-none group transition-colors"
          aria-label="Scroll to top"
          title="Back to Top"
        >
          <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.75] transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default ScrollToTop;
