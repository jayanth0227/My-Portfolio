"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  MessageSquare,
  FolderGit2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/registry/magicui/border-beam";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  status?: string;
}

interface ProjectItem {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<"messages" | "projects">("messages");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadDashboardData();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const loadDashboardData = async () => {
    setFetchingData(true);
    try {
      // 1. Fetch messages
      const msgRes = await fetch("/api/admin/messages");
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
      }

      // 2. Fetch projects
      const projRes = await fetch("/api/projects");
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setFetchingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      loadDashboardData();
    } catch {
      setError("Network or server error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@portfolio.dev");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] selection:bg-amber-500/20 selection:text-amber-600 dark:selection:text-amber-400 overflow-x-hidden flex flex-col justify-between">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Admin Gateway</span>
          </div>
          <AnimatedThemeToggler />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {isAuthenticated === null ? (
            // Loading session state
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-sm text-[var(--muted-fg)]"
            >
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <span>Verifying credentials...</span>
            </motion.div>
          ) : !isAuthenticated ? (
            // ==========================================
            // LOGIN CARD with BorderBeam Animation
            // ==========================================
            <motion.div
              key="login-card"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full flex justify-center"
            >
              <Card className="relative w-full max-w-[380px] overflow-hidden border-[var(--border)] bg-[var(--card-bg)] shadow-[0_10px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                {/* Header */}
                <CardHeader className="space-y-1.5 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
                      <Lock className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-fg)] border border-[var(--border)]">
                      PORTAL / v1.0
                    </span>
                  </div>

                  <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] pt-2">
                    Admin Access
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-[var(--muted-fg)]">
                    Enter your administrative credentials to access the portfolio management dashboard.
                  </CardDescription>
                </CardHeader>

                {/* Form Content */}
                <CardContent className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4" id="admin-login-form">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-[var(--foreground)]">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-fg)] pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@portfolio.dev"
                          className="pl-10 h-10 text-sm bg-[var(--background)] border-[var(--border)] focus-visible:ring-amber-500/40 focus-visible:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-semibold text-[var(--foreground)]">
                          Password
                        </Label>
                        <button
                          type="button"
                          onClick={handleQuickFill}
                          className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Quick Demo Fill</span>
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-fg)] pointer-events-none" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-10 text-sm bg-[var(--background)] border-[var(--border)] focus-visible:ring-amber-500/40 focus-visible:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors p-1 cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Dev Credentials Info Hint */}
                  <div className="rounded-lg p-2.5 bg-[var(--muted)]/60 border border-[var(--border)] text-[11px] text-[var(--muted-fg)] leading-relaxed">
                    <span className="font-semibold text-[var(--foreground)]">Default Dev Credentials:</span>{" "}
                    <span className="font-mono text-amber-600 dark:text-amber-400">admin@portfolio.dev</span> /{" "}
                    <span className="font-mono text-amber-600 dark:text-amber-400">admin123</span>
                  </div>
                </CardContent>

                {/* Footer Buttons */}
                <CardFooter className="flex justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setEmail("");
                      setPassword("");
                      setError(null);
                    }}
                    className="w-1/2 text-xs sm:text-sm border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    form="admin-login-form"
                    disabled={loading}
                    className="w-1/2 text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    {loading ? (
                      <div className="inline-flex items-center gap-2">
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>

                {/* Dynamic BorderBeam Effect */}
                <BorderBeam
                  duration={8}
                  size={120}
                  colorFrom="#f59e0b"
                  colorTo="#eab308"
                  borderWidth={1.5}
                />
              </Card>
            </motion.div>
          ) : (
            // ==========================================
            // AUTHENTICATED ADMIN DASHBOARD
            // ==========================================
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl space-y-6"
            >
              {/* Dashboard Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
                      Admin Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-[var(--muted-fg)]">
                      Logged in as <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">admin@portfolio.dev</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadDashboardData}
                    disabled={fetchingData}
                    className="gap-2 text-xs"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${fetchingData ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-500/10 border-red-500/30"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted-fg)] font-medium">Inquiries</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mt-1">
                      {messages.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted-fg)] font-medium">Projects</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mt-1">
                      {projects.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FolderGit2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted-fg)] font-medium">Gateway</p>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live &amp; Secure
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Tabs Switcher */}
              <div className="flex gap-2 border-b border-[var(--border)] pb-2">
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "messages"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  Contact Messages ({messages.length})
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "projects"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  Portfolio Projects ({projects.length})
                </button>
              </div>

              {/* Tab: Messages */}
              {activeTab === "messages" && (
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[var(--border)] text-[var(--muted-fg)]">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No contact inquiries yet.</p>
                      <p className="text-xs text-[var(--muted-fg)] mt-1">
                        Messages sent through the portfolio contact form will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-amber-500/40 transition-colors shadow-xs space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[var(--muted-fg)]">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[var(--foreground)]">{msg.name}</span>
                              <span className="font-mono text-xs">({msg.email})</span>
                            </div>
                            <span className="text-[11px] text-[var(--muted-fg)]">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {msg.subject && (
                            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                              Subject: {msg.subject}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Projects */}
              {activeTab === "projects" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((proj, idx) => (
                    <div
                      key={proj._id || idx}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden shadow-xs hover:border-amber-500/40 transition-all flex flex-col justify-between"
                    >
                      {proj.imageUrl && (
                        <div className="relative h-36 w-full overflow-hidden bg-zinc-900">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-[var(--foreground)]">{proj.title}</h3>
                          <p className="text-xs text-[var(--muted-fg)] line-clamp-2 mt-1">
                            {proj.description}
                          </p>
                        </div>

                        <div className="pt-2">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {proj.tags?.slice(0, 3).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-fg)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)] text-xs">
                            {proj.liveUrl && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
                              >
                                <span>Demo</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[var(--muted-fg)] hover:text-[var(--foreground)] ml-auto"
                              >
                                <span>Code</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 px-6 text-center text-xs text-[var(--muted-fg)] border-t border-[var(--border)] bg-[var(--background)]/60">
        <p>Portfolio Admin Gateway &bull; Protected &bull; Authorized Personnel Only</p>
      </footer>
    </div>
  );
}
