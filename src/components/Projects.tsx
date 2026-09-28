"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  FolderGit2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Code2,
  Globe,
  RefreshCw,
} from "lucide-react";
import { IProject } from "@/models/Project";
import { DEFAULT_PROJECTS } from "@/lib/projectDefaults";
import { StripedPattern } from "@/registry/magicui/striped-pattern";

export default function Projects() {
  const [projects, setProjects] = useState<IProject[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects?_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();

    const handleUpdate = () => {
      fetchProjects();
    };

    window.addEventListener("portfolio-projects-updated", handleUpdate);
    return () => {
      window.removeEventListener("portfolio-projects-updated", handleUpdate);
    };
  }, [fetchProjects]);

  // Extract unique categories dynamically
  const categories = [
    "All",
    ...Array.from(
      new Set(
        projects
          .map((p) => p.category)
          .filter((c): c is string => Boolean(c && c.trim()))
      )
    ),
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (p) =>
            (p.category || "Full-Stack").toLowerCase() ===
            activeCategory.toLowerCase()
        );

  return (
    <section
      id="projects"
      className="relative w-full overflow-hidden bg-[var(--background)] py-16 sm:py-24 lg:py-28 scroll-mt-6"
    >
      {/* Interactive Striped Lines Pattern with Reactive Physics & Motion Particles */}
      <StripedPattern
        spacing={38}
        strokeDasharray="4 2"
        className="[mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] px-3.5 py-1 text-xs font-semibold text-[var(--badge-text)] shadow-xs mb-3.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>Featured Engineering Work</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
            Crafted for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500">Scale, Performance</span> &amp; Impact
          </h2>

          <p className="mt-4 text-xs sm:text-base text-[var(--muted-fg)] max-w-2xl leading-relaxed">
            A showcase of production-ready enterprise platforms, cloud-native microservices, dynamic SaaS tools, and real-time distributed applications.
          </p>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[var(--muted)]/60 border border-[var(--border)] backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)]/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project._id || `proj-${idx}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(202,138,4,0.15)] hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Top Image Preview Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900/80">
                  <img
                    src={project.imageUrl || "/project-placeholder.jpg"}
                    alt={project.title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    {project.featured ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 shadow-md backdrop-blur-sm">
                        <Sparkles className="h-3 w-3 fill-zinc-950" />
                        Featured
                      </span>
                    ) : (
                      <div />
                    )}

                    {project.category && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white/90 border border-white/15 backdrop-blur-md">
                        {project.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[var(--muted-fg)] line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="mt-5 pt-3.5 border-t border-[var(--border)]">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags && project.tags.length > 0 ? (
                        project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-fg)] border border-[var(--border)]"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--muted-fg)]">
                          Full-Stack Architecture
                        </span>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2 pt-1">
                      {project.liveUrl && project.liveUrl !== "#" ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 px-3.5 py-1.5 sm:py-2 text-xs font-bold shadow-xs transition-all duration-200 cursor-pointer flex-1"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>Live Demo</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold px-3 py-1.5 text-[var(--muted-fg)] bg-[var(--muted)]/50 rounded-xl flex-1 cursor-default">
                          <span>Enterprise Solution</span>
                        </div>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] hover:border-amber-500/50 hover:bg-[var(--muted)] text-[var(--foreground)] px-3 py-1.5 sm:py-2 text-xs font-semibold transition-all duration-200"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
