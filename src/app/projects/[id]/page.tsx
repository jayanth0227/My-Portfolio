"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Code2,
  Sparkles,
  Layers,
  Terminal,
  Calendar,
  CheckCircle2,
  Share2,
  Check,
  Cpu,
  ArrowUpRight,
} from "lucide-react";
import { IProject } from "@/models/Project";
import { DEFAULT_PROJECTS } from "@/lib/projectDefaults";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { StripedPattern } from "@/registry/magicui/striped-pattern";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}?_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.project) {
            setProject(data.project);
            return;
          }
        }

        // Fallback to local default projects
        const fallback = DEFAULT_PROJECTS.find(
          (p) =>
            p._id === projectId ||
            (p.title &&
              p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === projectId)
        );
        if (fallback) {
          setProject(fallback);
        }
      } catch (err) {
        console.error("Failed to load project details:", err);
        const fallback = DEFAULT_PROJECTS.find((p) => p._id === projectId);
        if (fallback) setProject(fallback);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackToProjects = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("portfolio_has_loaded", "true");
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/#projects");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--background)] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-[var(--muted-fg)]">Loading project specifications...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen w-full bg-[var(--background)] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md p-8 rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xl">
          <Terminal className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Project Not Found</h1>
          <p className="text-sm text-[var(--muted-fg)] mb-6">
            The requested project could not be found or may have been archived.
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("portfolio_has_loaded", "true");
              }
              router.push("/#projects");
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </button>
        </div>
      </div>
    );
  }

  const slug = (project.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="min-h-screen w-full bg-[var(--background)] selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] relative pb-20">
      {/* Background Striped Pattern */}
      <StripedPattern spacing={38} strokeDasharray="4 2" />

      {/* Top Floating Navigation */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl pointer-events-auto">
          <SpotlightNavbar />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 sm:pt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Back Action */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={handleBackToProjects}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--card-bg)]/80 hover:bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] text-xs font-semibold backdrop-blur-md transition-all shadow-xs hover:-translate-x-0.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-amber-500" />
            <span>Back to Projects</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--card-bg)]/80 hover:bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] text-xs font-medium backdrop-blur-md transition-all shadow-xs cursor-pointer"
              title="Copy Page Link"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-[var(--muted-fg)]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* macOS Terminal Window Container */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-[var(--border)] dark:border-white/10 bg-[var(--card-bg)] dark:bg-[#011522] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Top Tools Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-100/80 dark:bg-[#010f18] border-b border-[var(--border)] dark:border-white/10 select-none">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff605c] shadow-[0_0_6px_rgba(255,96,92,0.4)]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd44] shadow-[0_0_6px_rgba(255,189,68,0.4)]" />
              <span className="h-3 w-3 rounded-full bg-[#00ca4e] shadow-[0_0_6px_rgba(0,202,78,0.4)]" />
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-[var(--muted-fg)] dark:text-[#7d9cb3]">
              <Terminal className="h-3.5 w-3.5 text-amber-500" />
              <span>~/projects/{slug}.tsx</span>
            </div>

            <div className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-fg)]">
              {project.category || "Full-Stack"}
            </div>
          </div>

          {/* Side-by-Side Content Grid: Image on Left, Details & Description on Right */}
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* LEFT COLUMN: Inset Image Preview & Launch Actions */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-[var(--border)] dark:border-white/10 shadow-lg group">
                  <img
                    src={project.imageUrl || "/project-placeholder.jpg"}
                    alt={project.title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {project.featured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                        <Sparkles className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    ) : (
                      <div />
                    )}

                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-mono font-bold border border-white/20 backdrop-blur-md">
                      {project.category || "Full-Stack"}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons Under Image */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {project.liveUrl && project.liveUrl !== "#" ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition-all flex-1 cursor-pointer"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Live Demo</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--muted)] text-[var(--muted-fg)] text-xs font-semibold flex-1">
                      <span>Enterprise Deployment</span>
                    </div>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] dark:border-white/20 hover:bg-[var(--muted)] text-[var(--foreground)] font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      <Code2 className="h-4 w-4" />
                      <span>Inspect Source</span>
                    </a>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Project Title, Full Description & Tech Stack */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Title & Subtitle */}
                  <div className="pb-4 border-b border-[var(--border)] dark:border-white/10">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight">
                      {project.title}
                    </h1>
                    <p className="mt-1.5 text-xs font-mono text-[var(--muted-fg)]">
                      Production Engineering Specification • High Performance Architecture
                    </p>
                  </div>

                  {/* Executive Overview & Full Description */}
                  <div className="py-4 border-b border-[var(--border)] dark:border-white/10">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-2.5 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      <span>Executive Overview & Architecture</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Stack Deployed */}
                  <div className="pt-4">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>Technologies & Frameworks Deployed</span>
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {project.tags && project.tags.length > 0 ? (
                        project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] dark:border-white/10 font-mono text-xs font-medium shadow-xs"
                          >
                            <CheckCircle2 className="h-3 w-3 text-amber-500" />
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-mono text-[var(--muted-fg)]">
                          Full-Stack Modular Architecture
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <ScrollToTop />
    </div>
  );
}
