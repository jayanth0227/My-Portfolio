"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowUpRight,
  Code2,
  Globe,
  Share2,
  Check,
  Terminal,
  Layers,
} from "lucide-react";
import { IProject } from "@/models/Project";
import { DEFAULT_PROJECTS } from "@/lib/projectDefaults";
import { Magnetic } from "@/components/ui/magnetic";
import "./Projects.css";

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState<IProject[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopyLink = (e: React.MouseEvent, project: IProject) => {
    e.stopPropagation();
    const url = project.liveUrl && project.liveUrl !== "#" ? project.liveUrl : window.location.href;
    navigator.clipboard.writeText(url);
    const id = project._id || project.title;
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleCardClick = (project: IProject) => {
    const slug = (project.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const targetId = project._id || slug;
    router.push(`/projects/${targetId}`);
  };

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
    <div className="relative z-10 w-full pt-1 pb-4 sm:pt-2 sm:pb-6 lg:pt-2 lg:pb-8">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-1 sm:pt-2 mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] px-3.5 py-1 text-xs font-semibold text-[var(--badge-text)] shadow-xs mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>Featured Engineering Work</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
            Crafted for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500">Scale, Performance</span> &amp; Impact
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[var(--muted-fg)] max-w-2xl leading-relaxed">
            A showcase of production-ready enterprise platforms, cloud-native microservices, dynamic SaaS tools, and real-time distributed applications.
          </p>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 p-1 rounded-2xl bg-[var(--muted)]/60 border border-[var(--border)] backdrop-blur-md">
              {categories.map((cat) => (
                <Magnetic key={cat} strength={0.2}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      activeCategory === cat
                        ? "bg-amber-500 text-zinc-950 shadow-xs font-bold"
                        : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)]/80"
                    }`}
                  >
                    {cat}
                  </button>
                </Magnetic>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid with Offset Image Inset & Hidden Description */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          >
            {filteredProjects.map((project, idx) => {
              const projId = project._id || `proj-${idx}`;
              const slug = (project.title || "project")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");

              return (
                <motion.div
                  key={projId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => handleCardClick(project)}
                  className="project-uiverse-card group"
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${project.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCardClick(project);
                    }
                  }}
                >
                  {/* Top Tools Bar (From Uiverse.io by EmmaxPlay) */}
                  <div className="tools">
                    <div className="tools-left">
                      <div className="circle">
                        <span className="red box" />
                      </div>
                      <div className="circle">
                        <span className="yellow box" />
                      </div>
                      <div className="circle">
                        <span className="green box" />
                      </div>
                    </div>

                    {/* Window File / Tab Identifier */}
                    <div className="tools-title">
                      <Terminal className="h-3 w-3 text-amber-500/80" />
                      <span>{slug}.tsx</span>
                    </div>
                  </div>

                  {/* Card Content Container */}
                  <div className="card__content">
                    {/* Inset / Offset Image Box */}
                    <div className="project-image-inset-wrap">
                      <div className="project-image-box">
                        <img
                          src={project.imageUrl || "/project-placeholder.jpg"}
                          alt={project.title}
                          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Badges on Image */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                          {project.featured ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 shadow-md backdrop-blur-sm">
                              <Sparkles className="h-2.5 w-2.5 fill-zinc-950" />
                              Featured
                            </span>
                          ) : (
                            <div />
                          )}

                          {project.category && (
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 text-white/90 border border-white/15 backdrop-blur-md">
                              {project.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Body (Compact: Title & Tech Tags, Description is Hidden) */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <ArrowUpRight className="h-4 w-4 text-amber-500 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      {/* Tech Stack Pills & Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-[var(--border)] dark:border-white/10">
                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1 mb-3.5">
                          {project.tags && project.tags.length > 0 ? (
                            project.tags.slice(0, 4).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="inline-flex items-center text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-fg)] border border-[var(--border)] dark:border-white/10"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-mono text-[var(--muted-fg)]">
                              Full-Stack
                            </span>
                          )}
                          {project.tags && project.tags.length > 4 && (
                            <span className="inline-flex items-center text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md text-amber-500 bg-amber-500/10">
                              +{project.tags.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-2">
                          {project.liveUrl && project.liveUrl !== "#" ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 px-3 py-1.5 text-xs font-bold shadow-xs transition-all duration-200 cursor-pointer flex-1"
                            >
                              <Globe className="h-3.5 w-3.5" />
                              <span>Live Demo</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(project);
                              }}
                              className="inline-flex items-center justify-center gap-1 text-xs font-semibold px-3 py-1.5 text-[var(--muted-fg)] bg-[var(--muted)]/50 hover:bg-[var(--muted)] rounded-xl flex-1 cursor-pointer transition-colors"
                            >
                              <span>View Specs</span>
                            </div>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] dark:border-white/15 hover:border-amber-500/50 hover:bg-[var(--muted)] text-[var(--foreground)] px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer"
                              title="View Source Code"
                            >
                              <Code2 className="h-3.5 w-3.5" />
                              <span>Source</span>
                            </a>
                          )}

                          {/* Quick Share / Copy Link Button */}
                          <button
                            onClick={(e) => handleCopyLink(e, project)}
                            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] dark:border-white/15 hover:border-amber-500/50 hover:bg-[var(--muted)] text-[var(--foreground)] p-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0"
                            title={copiedId === projId ? "Link Copied!" : "Share / Copy Link"}
                            aria-label="Share Project"
                          >
                            {copiedId === projId ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Share2 className="h-3.5 w-3.5 text-[var(--muted-fg)] group-hover:text-[var(--foreground)]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
