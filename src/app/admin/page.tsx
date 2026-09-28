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
  RefreshCw,
  ExternalLink,
  FileText,
  UploadCloud,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Download,
  FileUp,
  Check,
  FileCheck,
  Building2,
  Phone,
  Droplets,
  UserCheck,
  QrCode,
  Type,
  Terminal as TerminalIcon,
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
import { QRCodeSVG } from "qrcode.react";

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
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<"content" | "about" | "messages" | "projects">("content");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Content CMS State
  const [contentForm, setContentForm] = useState({
    navbarBrandName: "Jayanth Sai Chikkala",
    heroBadgeText: "Available for New Projects",
    heroTitleLine1: "Building Scalable",
    heroTitleLine2: "Digital Experiences",
    heroDescription:
      "Java & Spring Boot Full Stack Developer crafting scalable, production-ready applications with modern frontend technologies, robust backend APIs, cloud infrastructure, and clean architecture.",
    heroAvatarUrl: "/profile.png",
    heroAvatarPublicId: "",
    heroResumePdfUrl: "",
    heroResumePdfPublicId: "",
    heroContactButtonText: "Get In Touch",
    heroResumeButtonText: "Download CV",
  });
  const [savingContent, setSavingContent] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);
  const [contentSaveError, setContentSaveError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // About & ID Card CMS State
  const [aboutForm, setAboutForm] = useState({
    companyLine1: "SPESHWAY",
    companyLine2: "SOLUTIONS",
    companyLogoUrl: "",
    companyLogoPublicId: "",
    idCardPhotoUrl: "/id-avatar.webp",
    idCardPhotoPublicId: "",
    fullName: "JAYANTH SAI CHIKKALA",
    designation: "ASSOCIATE SOFTWARE ENGINEER",
    mobile: "+91 9010253076",
    bloodGroup: "O+",
    footerRole: "EMPLOYEE",
    footerDepartment: "SOFTWARE DEVELOPMENT",
    linkedinUrl: "https://www.linkedin.com/in/jayanth-sai-chikkala/",
    terminalBadge: "Developer Console",
    terminalHeading: "Building User-Centric, Scalable Solutions Across All Platforms",
    terminalWhoami: "Jayanth Sai Chikkala — Associate Software Engineer",
    terminalAbout1: "Building user-centric, high-impact digital applications across platforms.",
    terminalAbout2: "Passionate about transforming complex workflows into intuitive, resilient software.",
    terminalCapability1: "Web Applications   — High-performance Next.js & React cloud systems",
    terminalCapability2: "Enterprise ERPs    — Scalable workflow engines & operational platforms",
    terminalCapability3: "Mobile Apps        — Cross-platform iOS & Android apps with fluid UX",
    terminalCapability4: "Desktop Apps       — Native-grade desktop tools built for stability",
    terminalStatus: "Available for New High-Impact Engineering Projects",
    terminalPill1: "⚡ Cloud-Native",
    terminalPill2: "🔒 Scalable ERP & Systems",
    terminalPill3: "🎯 Web • Mobile • Desktop",
    terminalCtaText: "Get In Touch",
    terminalCtaUrl: "#contact",
  });
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutSaved, setAboutSaved] = useState(false);
  const [aboutSaveError, setAboutSaveError] = useState<string | null>(null);
  const [uploadingIdPhoto, setUploadingIdPhoto] = useState(false);
  const [uploadingCompanyLogo, setUploadingCompanyLogo] = useState(false);
  const [aboutUploadError, setAboutUploadError] = useState<string | null>(null);

  // Check existing session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          if (data.email) setAdminEmail(data.email);
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

      // 3. Fetch portfolio content
      const contentRes = await fetch(`/api/admin/content?_t=${Date.now()}`, {
        cache: "no-store",
      });
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        if (contentData.content) {
          setContentForm({
            navbarBrandName: contentData.content.navbar?.brandName || "Jayanth Sai Chikkala",
            heroBadgeText: contentData.content.hero?.badgeText || "Available for New Projects",
            heroTitleLine1: contentData.content.hero?.titleLine1 || "Building Scalable",
            heroTitleLine2: contentData.content.hero?.titleLine2 || "Digital Experiences",
            heroDescription:
              contentData.content.hero?.description ||
              "Java & Spring Boot Full Stack Developer crafting scalable, production-ready applications with modern frontend technologies, robust backend APIs, cloud infrastructure, and clean architecture.",
            heroAvatarUrl: contentData.content.hero?.avatarUrl || "/profile.png",
            heroAvatarPublicId: contentData.content.hero?.avatarPublicId || "",
            heroResumePdfUrl: contentData.content.hero?.resumePdfUrl || "",
            heroResumePdfPublicId: contentData.content.hero?.resumePdfPublicId || "",
            heroContactButtonText: contentData.content.hero?.contactButtonText || "Get In Touch",
            heroResumeButtonText: contentData.content.hero?.resumeButtonText || "Download CV",
          });

          if (contentData.content.about) {
            setAboutForm({
              companyLine1: contentData.content.about.companyLine1 || "SPESHWAY",
              companyLine2: contentData.content.about.companyLine2 || "SOLUTIONS",
              companyLogoUrl: contentData.content.about.companyLogoUrl || "",
              companyLogoPublicId: contentData.content.about.companyLogoPublicId || "",
              idCardPhotoUrl: contentData.content.about.idCardPhotoUrl || "/id-avatar.webp",
              idCardPhotoPublicId: contentData.content.about.idCardPhotoPublicId || "",
              fullName: contentData.content.about.fullName || "JAYANTH SAI CHIKKALA",
              designation: contentData.content.about.designation || "ASSOCIATE SOFTWARE ENGINEER",
              mobile: contentData.content.about.mobile || "+91 9010253076",
              bloodGroup: contentData.content.about.bloodGroup || "O+",
              footerRole: contentData.content.about.footerRole || "EMPLOYEE",
              footerDepartment: contentData.content.about.footerDepartment || "SOFTWARE DEVELOPMENT",
              linkedinUrl: contentData.content.about.linkedinUrl || "https://www.linkedin.com/in/jayanth-sai-chikkala/",
              terminalBadge: contentData.content.about.terminalBadge || "Developer Console",
              terminalHeading: contentData.content.about.terminalHeading || "Building User-Centric, Scalable Solutions Across All Platforms",
              terminalWhoami: contentData.content.about.terminalWhoami || "Jayanth Sai Chikkala — Associate Software Engineer",
              terminalAbout1: contentData.content.about.terminalAbout1 || "Building user-centric, high-impact digital applications across platforms.",
              terminalAbout2: contentData.content.about.terminalAbout2 || "Passionate about transforming complex workflows into intuitive, resilient software.",
              terminalCapability1: contentData.content.about.terminalCapability1 || "Web Applications   — High-performance Next.js & React cloud systems",
              terminalCapability2: contentData.content.about.terminalCapability2 || "Enterprise ERPs    — Scalable workflow engines & operational platforms",
              terminalCapability3: contentData.content.about.terminalCapability3 || "Mobile Apps        — Cross-platform iOS & Android apps with fluid UX",
              terminalCapability4: contentData.content.about.terminalCapability4 || "Desktop Apps       — Native-grade desktop tools built for stability",
              terminalStatus: contentData.content.about.terminalStatus || "Available for New High-Impact Engineering Projects",
              terminalPill1: contentData.content.about.terminalPill1 || "⚡ Cloud-Native",
              terminalPill2: contentData.content.about.terminalPill2 || "🔒 Scalable ERP & Systems",
              terminalPill3: contentData.content.about.terminalPill3 || "🎯 Web • Mobile • Desktop",
              terminalCtaText: contentData.content.about.terminalCtaText || "Get In Touch",
              terminalCtaUrl: contentData.content.about.terminalCtaUrl || "#contact",
            });
          }
        }
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
      if (data.user?.email) setAdminEmail(data.user.email);
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

  const handleUploadFile = async (file: File, folder: string = "portfolio") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Upload to Cloudinary failed");
    }
    return { url: data.url as string, publicId: (data.publicId || "") as string };
  };

  const onAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setUploadError(null);
    try {
      const res = await handleUploadFile(file, "portfolio/avatars");
      const updated = {
        ...contentForm,
        heroAvatarUrl: res.url,
        heroAvatarPublicId: res.publicId,
      };
      setContentForm(updated);

      // Auto-persist immediately to MongoDB
      const saveRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: {
            badgeText: updated.heroBadgeText,
            titleLine1: updated.heroTitleLine1,
            titleLine2: updated.heroTitleLine2,
            description: updated.heroDescription,
            avatarUrl: updated.heroAvatarUrl,
            avatarPublicId: updated.heroAvatarPublicId,
            resumePdfUrl: updated.heroResumePdfUrl,
            resumePdfPublicId: updated.heroResumePdfPublicId,
            contactButtonText: updated.heroContactButtonText,
            resumeButtonText: updated.heroResumeButtonText,
          },
        }),
      });

      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Uploaded to Cloudinary but failed to save to database");
      }

      setContentSaved(true);
      setTimeout(() => setContentSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload avatar to Cloudinary");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setUploadError("Please select a valid PDF file for the resume.");
      return;
    }
    setUploadingResume(true);
    setUploadError(null);
    try {
      const res = await handleUploadFile(file, "portfolio/resumes");
      const updated = {
        ...contentForm,
        heroResumePdfUrl: res.url,
        heroResumePdfPublicId: res.publicId,
      };
      setContentForm(updated);

      // Auto-persist immediately to MongoDB
      const saveRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: {
            badgeText: updated.heroBadgeText,
            titleLine1: updated.heroTitleLine1,
            titleLine2: updated.heroTitleLine2,
            description: updated.heroDescription,
            avatarUrl: updated.heroAvatarUrl,
            avatarPublicId: updated.heroAvatarPublicId,
            resumePdfUrl: updated.heroResumePdfUrl,
            resumePdfPublicId: updated.heroResumePdfPublicId,
            contactButtonText: updated.heroContactButtonText,
            resumeButtonText: updated.heroResumeButtonText,
          },
        }),
      });

      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Uploaded resume to Cloudinary but failed to save to database");
      }

      setContentSaved(true);
      setTimeout(() => setContentSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload resume PDF to Cloudinary");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingContent(true);
    setContentSaveError(null);
    setContentSaved(false);

    try {
      const payload = {
        navbar: {
          brandName: contentForm.navbarBrandName,
        },
        hero: {
          badgeText: contentForm.heroBadgeText,
          titleLine1: contentForm.heroTitleLine1,
          titleLine2: contentForm.heroTitleLine2,
          description: contentForm.heroDescription,
          avatarUrl: contentForm.heroAvatarUrl,
          avatarPublicId: contentForm.heroAvatarPublicId,
          resumePdfUrl: contentForm.heroResumePdfUrl,
          resumePdfPublicId: contentForm.heroResumePdfPublicId,
          contactButtonText: contentForm.heroContactButtonText,
          resumeButtonText: contentForm.heroResumeButtonText,
        },
      };

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update content");
      }

      setContentSaved(true);
      setTimeout(() => setContentSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setContentSaveError(err instanceof Error ? err.message : "Failed to save portfolio content");
    } finally {
      setSavingContent(false);
    }
  };

  const onIdPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdPhoto(true);
    setAboutUploadError(null);
    try {
      const res = await handleUploadFile(file, "portfolio/idcard");
      const updated = {
        ...aboutForm,
        idCardPhotoUrl: res.url,
        idCardPhotoPublicId: res.publicId,
      };
      setAboutForm(updated);

      // Auto-persist immediately to MongoDB
      const saveRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          about: updated,
        }),
      });

      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Uploaded ID photo to Cloudinary but failed to save to database");
      }

      setAboutSaved(true);
      setTimeout(() => setAboutSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setAboutUploadError(err instanceof Error ? err.message : "Failed to upload ID photo to Cloudinary");
    } finally {
      setUploadingIdPhoto(false);
    }
  };

  const onCompanyLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCompanyLogo(true);
    setAboutUploadError(null);
    try {
      const res = await handleUploadFile(file, "portfolio/logos");
      const updated = {
        ...aboutForm,
        companyLogoUrl: res.url,
        companyLogoPublicId: res.publicId,
      };
      setAboutForm(updated);

      // Auto-persist immediately to MongoDB
      const saveRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          about: updated,
        }),
      });

      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Uploaded logo to Cloudinary but failed to save to database");
      }

      setAboutSaved(true);
      setTimeout(() => setAboutSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setAboutUploadError(err instanceof Error ? err.message : "Failed to upload company logo to Cloudinary");
    } finally {
      setUploadingCompanyLogo(false);
    }
  };

  const handleSaveAbout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingAbout(true);
    setAboutSaveError(null);
    setAboutSaved(false);

    try {
      const payload = {
        about: {
          companyLine1: aboutForm.companyLine1,
          companyLine2: aboutForm.companyLine2,
          companyLogoUrl: aboutForm.companyLogoUrl,
          companyLogoPublicId: aboutForm.companyLogoPublicId,
          idCardPhotoUrl: aboutForm.idCardPhotoUrl,
          idCardPhotoPublicId: aboutForm.idCardPhotoPublicId,
          fullName: aboutForm.fullName,
          designation: aboutForm.designation,
          mobile: aboutForm.mobile,
          bloodGroup: aboutForm.bloodGroup,
          footerRole: aboutForm.footerRole,
          footerDepartment: aboutForm.footerDepartment,
          linkedinUrl: aboutForm.linkedinUrl,
          terminalBadge: aboutForm.terminalBadge,
          terminalHeading: aboutForm.terminalHeading,
          terminalWhoami: aboutForm.terminalWhoami,
          terminalAbout1: aboutForm.terminalAbout1,
          terminalAbout2: aboutForm.terminalAbout2,
          terminalCapability1: aboutForm.terminalCapability1,
          terminalCapability2: aboutForm.terminalCapability2,
          terminalCapability3: aboutForm.terminalCapability3,
          terminalCapability4: aboutForm.terminalCapability4,
          terminalStatus: aboutForm.terminalStatus,
          terminalPill1: aboutForm.terminalPill1,
          terminalPill2: aboutForm.terminalPill2,
          terminalPill3: aboutForm.terminalPill3,
          terminalCtaText: aboutForm.terminalCtaText,
          terminalCtaUrl: aboutForm.terminalCtaUrl,
        },
      };

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update About ID Card content");
      }

      setAboutSaved(true);
      setTimeout(() => setAboutSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setAboutSaveError(err instanceof Error ? err.message : "Failed to save About ID Card content");
    } finally {
      setSavingAbout(false);
    }
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
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
                      <Lock className="h-5 w-5" />
                    </div>
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
                    {/* Email / Username Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-[var(--foreground)]">
                        Email or Username
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-fg)] pointer-events-none" />
                        <Input
                          id="email"
                          type="text"
                          autoComplete="username"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email or username"
                          className="pl-10 h-10 text-sm bg-[var(--background)] border-[var(--border)] focus-visible:ring-amber-500/40 focus-visible:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-xs font-semibold text-[var(--foreground)]">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-fg)] pointer-events-none" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
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
                      Logged in as{" "}
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                        {adminEmail || "jayanthyeswanth9@gmail.com"}
                      </span>
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
              <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-2">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "content"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Home &amp; Hero CMS</span>
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "about"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>About &amp; ID Card CMS</span>
                </button>
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

              {/* Tab: Home & Hero CMS */}
              {activeTab === "content" && (
                <div className="space-y-6">
                  {/* Status Alerts */}
                  {contentSaved && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3 shadow-xs"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-semibold">Changes Saved Successfully!</p>
                        <p className="text-xs opacity-90">All changes have been saved to MongoDB and are now live on your portfolio.</p>
                      </div>
                    </motion.div>
                  )}

                  {contentSaveError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{contentSaveError}</p>
                    </div>
                  )}

                  {uploadError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{uploadError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSaveContent} className="space-y-6">
                    {/* Top Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                          <span>Portfolio Content Management</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-normal">
                            Live Sync
                          </span>
                        </h2>
                        <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                          Edit texts, upload portrait cutout photos, and upload your resume PDF to Cloudinary.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        disabled={savingContent || uploadingAvatar || uploadingResume}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-6 shadow-md hover:shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
                      >
                        {savingContent ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            <span>Saving to DB...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1.5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column: Navbar & Textual Content */}
                      <div className="space-y-6">
                        {/* 1. Navbar Branding */}
                        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-amber-500" />
                              <span>1. Navbar Brand Name</span>
                            </h3>
                            <span className="text-[11px] text-[var(--muted-fg)]">Top floating bar</span>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="navbarBrand" className="text-xs font-semibold">
                              Signature Brand Text
                            </Label>
                            <Input
                              id="navbarBrand"
                              value={contentForm.navbarBrandName}
                              onChange={(e) =>
                                setContentForm((prev) => ({ ...prev, navbarBrandName: e.target.value }))
                              }
                              placeholder="Jayanth Sai Chikkala"
                              className="text-sm bg-[var(--background)]"
                            />
                            <div className="p-3 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] flex items-center justify-between">
                              <span className="text-xs text-[var(--muted-fg)]">Signature Preview:</span>
                              <span className="font-signature text-xl font-bold text-amber-500 dark:text-amber-400">
                                {contentForm.navbarBrandName || "Jayanth Sai Chikkala"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Hero Headlines & Badge */}
                        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                              <Type className="h-4 w-4 text-amber-500" />
                              <span>2. Hero Typography &amp; Actions</span>
                            </h3>
                            <span className="text-[11px] text-[var(--muted-fg)]">Hero headlines</span>
                          </div>

                          <div className="space-y-3.5">
                            <div className="space-y-1.5">
                              <Label htmlFor="heroBadge" className="text-xs font-semibold">
                                Status Badge Text
                              </Label>
                              <Input
                                id="heroBadge"
                                value={contentForm.heroBadgeText}
                                onChange={(e) =>
                                  setContentForm((prev) => ({ ...prev, heroBadgeText: e.target.value }))
                                }
                                placeholder="Available for New Projects"
                                className="text-sm bg-[var(--background)]"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="heroTitle1" className="text-xs font-semibold">
                                Title Line 1 (Solid Foreground Color)
                              </Label>
                              <Input
                                id="heroTitle1"
                                value={contentForm.heroTitleLine1}
                                onChange={(e) =>
                                  setContentForm((prev) => ({ ...prev, heroTitleLine1: e.target.value }))
                                }
                                placeholder="Building Scalable"
                                className="text-sm bg-[var(--background)]"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="heroTitle2" className="text-xs font-semibold">
                                Title Line 2 (Amber Gradient Highlight)
                              </Label>
                              <Input
                                id="heroTitle2"
                                value={contentForm.heroTitleLine2}
                                onChange={(e) =>
                                  setContentForm((prev) => ({ ...prev, heroTitleLine2: e.target.value }))
                                }
                                placeholder="Digital Experiences"
                                className="text-sm bg-[var(--background)]"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="heroDesc" className="text-xs font-semibold">
                                Hero Section Description
                              </Label>
                              <textarea
                                id="heroDesc"
                                rows={4}
                                value={contentForm.heroDescription}
                                onChange={(e) =>
                                  setContentForm((prev) => ({ ...prev, heroDescription: e.target.value }))
                                }
                                placeholder="Java & Spring Boot Full Stack Developer crafting scalable..."
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs sm:text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:border-amber-500 transition-all resize-y leading-relaxed"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div className="space-y-1.5">
                                <Label htmlFor="btnContact" className="text-xs font-semibold">
                                  Primary Button Text
                                </Label>
                                <Input
                                  id="btnContact"
                                  value={contentForm.heroContactButtonText}
                                  onChange={(e) =>
                                    setContentForm((prev) => ({ ...prev, heroContactButtonText: e.target.value }))
                                  }
                                  placeholder="Get In Touch"
                                  className="text-xs sm:text-sm bg-[var(--background)]"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="btnResume" className="text-xs font-semibold">
                                  Secondary Button Text
                                </Label>
                                <Input
                                  id="btnResume"
                                  value={contentForm.heroResumeButtonText}
                                  onChange={(e) =>
                                    setContentForm((prev) => ({ ...prev, heroResumeButtonText: e.target.value }))
                                  }
                                  placeholder="Download CV"
                                  className="text-xs sm:text-sm bg-[var(--background)]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Media (Portrait Cutout & Resume PDF) */}
                      <div className="space-y-6">
                        {/* 3. Developer Cutout Photo (Cloudinary) */}
                        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-amber-500" />
                              <span>3. Hero Portrait Cutout Photo</span>
                            </h3>
                            <span className="text-[11px] text-[var(--muted-fg)]">Cloudinary Media</span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)]">
                              <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-zinc-900/50 border border-[var(--border)] flex items-center justify-center">
                                <img
                                  src={contentForm.heroAvatarUrl || "/profile.png"}
                                  alt="Portrait Preview"
                                  className="h-full w-full object-contain object-bottom"
                                />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                                  {contentForm.heroAvatarUrl.startsWith("http")
                                    ? "Uploaded to Cloudinary"
                                    : "Default Local Portrait (/profile.png)"}
                                </p>
                                <p className="text-[11px] font-mono text-[var(--muted-fg)] truncate">
                                  {contentForm.heroAvatarUrl}
                                </p>
                                {contentForm.heroAvatarPublicId && (
                                  <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                    ID: {contentForm.heroAvatarPublicId}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="avatarUpload" className="text-xs font-semibold">
                                Upload New Portrait Cutout
                              </Label>
                              <div className="relative">
                                <input
                                  id="avatarUpload"
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingAvatar}
                                  onChange={onAvatarFileChange}
                                  className="block w-full text-xs text-[var(--muted-fg)] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/15 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-amber-500/25 file:cursor-pointer file:transition-colors border border-[var(--border)] rounded-xl bg-[var(--background)] p-1.5 cursor-pointer"
                                />
                                {uploadingAvatar && (
                                  <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <span>Uploading to Cloudinary...</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-[11px] text-[var(--muted-fg)]">
                                Transparent PNG/WEBP cutout portraits look best against the glowing ambient background.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 4. Resume / CV PDF Document (Cloudinary) */}
                        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                              <FileText className="h-4 w-4 text-amber-500" />
                              <span>4. Resume / CV PDF Document</span>
                            </h3>
                            <span className="text-[11px] text-[var(--muted-fg)]">Download CV Button</span>
                          </div>

                          <div className="space-y-3">
                            {/* Current PDF Status Banner */}
                            <div className="p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full overflow-hidden">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                  <FileCheck className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                                    {contentForm.heroResumePdfUrl ? "Cloudinary PDF Active" : "No Cloudinary PDF Uploaded"}
                                  </p>
                                  <p className="text-[11px] text-[var(--muted-fg)] truncate">
                                    {contentForm.heroResumePdfUrl || "Falling back to /resume.pdf"}
                                  </p>
                                </div>
                              </div>

                              <a
                                href="/api/resume"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-colors self-start sm:self-auto shrink-0"
                              >
                                <span>View PDF</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>

                            {/* File Upload Field */}
                            <div className="space-y-1.5">
                              <Label htmlFor="resumeUpload" className="text-xs font-semibold">
                                Upload New Resume PDF
                              </Label>
                              <div className="relative">
                                <input
                                  id="resumeUpload"
                                  type="file"
                                  accept=".pdf,application/pdf"
                                  disabled={uploadingResume}
                                  onChange={onResumeFileChange}
                                  className="block w-full text-xs text-[var(--muted-fg)] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/15 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-amber-500/25 file:cursor-pointer file:transition-colors border border-[var(--border)] rounded-xl bg-[var(--background)] p-1.5 cursor-pointer"
                                />
                                {uploadingResume && (
                                  <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <span>Uploading PDF to Cloudinary...</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Workflow explanation note */}
                            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-[var(--muted-fg)] space-y-1">
                              <p className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                <Download className="h-3.5 w-3.5" />
                                <span>Visitor Interaction Flow</span>
                              </p>
                              <p className="leading-relaxed">
                                When a user clicks <strong>&quot;{contentForm.heroResumeButtonText || "Download CV"}&quot;</strong> on the home page, it will open this Cloudinary PDF in a new tab. Visitors can review the document directly in the browser and download it with the browser&apos;s download action.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Save Action Card Bar */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-fg)]">
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[var(--foreground)]">Save Hero &amp; Brand Settings</p>
                          <p className="text-[11px]">Updates are persisted directly into MongoDB and synchronized in real-time across your live website.</p>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={savingContent || uploadingAvatar || uploadingResume}
                        className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-8 py-3 shadow-md hover:shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer text-sm shrink-0"
                      >
                        {savingContent ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            <span>Saving Changes to MongoDB...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1.5" />
                            <span>Save All Hero Changes</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab: About & ID Card CMS */}
              {activeTab === "about" && (
                <div className="space-y-6">
                  {/* Status Alerts */}
                  {aboutSaved && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3 shadow-xs"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-semibold">Changes Saved Successfully!</p>
                        <p className="text-xs opacity-90">All ID card and About section details have been saved to MongoDB and are now live on your portfolio.</p>
                      </div>
                    </motion.div>
                  )}

                  {aboutSaveError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{aboutSaveError}</p>
                    </div>
                  )}

                  {aboutUploadError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{aboutUploadError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSaveAbout} className="space-y-6">
                    {/* Top Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                          <span>About &amp; ID Card Management</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-normal">
                            Live Sync
                          </span>
                        </h2>
                        <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                          Manage ID badge credentials, company branding, photo, mobile, blood group, department, and LinkedIn QR code.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        disabled={savingAbout || uploadingIdPhoto || uploadingCompanyLogo}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-6 shadow-md hover:shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
                      >
                        {savingAbout ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            <span>Saving to DB...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1.5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* SECTION 1: PHYSICAL EMPLOYEE ID BADGE */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 pt-2">
                        <div>
                          <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span>A. Physical Employee ID Badge</span>
                          </h3>
                          <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                            Configure company branding, employee details, custom portrait photo, and interactive QR code.
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">ID Module</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column (7 cols): ID Card Details */}
                        <div className="lg:col-span-7 space-y-6">
                          {/* 1. Company Branding */}
                          <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-amber-500" />
                                <span>1. Company Branding on Badge</span>
                              </h3>
                              <span className="text-[11px] text-[var(--muted-fg)]">Top header</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <Label htmlFor="companyLine1" className="text-xs font-semibold">
                                  Company Name (Line 1 - Dark)
                                </Label>
                                <Input
                                  id="companyLine1"
                                  value={aboutForm.companyLine1}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, companyLine1: e.target.value }))
                                  }
                                  placeholder="SPESHWAY"
                                  className="text-sm bg-[var(--background)] font-bold tracking-wider"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="companyLine2" className="text-xs font-semibold">
                                  Accent / Secondary (Line 2 - Amber)
                                </Label>
                                <Input
                                  id="companyLine2"
                                  value={aboutForm.companyLine2}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, companyLine2: e.target.value }))
                                  }
                                  placeholder="SOLUTIONS"
                                  className="text-sm bg-[var(--background)] font-bold tracking-widest text-amber-600 dark:text-amber-400"
                                />
                              </div>
                            </div>

                            {/* Company Logo Upload */}
                            <div className="space-y-2 pt-2 border-t border-[var(--border)]/60">
                              <Label htmlFor="companyLogoUpload" className="text-xs font-semibold flex items-center gap-1.5">
                                <UploadCloud className="h-3.5 w-3.5 text-amber-500" />
                                <span>Company Brand Logo (Cloudinary)</span>
                              </Label>

                              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)]">
                                <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-[var(--background)] border border-amber-500/30 flex items-center justify-center p-1">
                                  {aboutForm.companyLogoUrl ? (
                                    <img
                                      src={aboutForm.companyLogoUrl}
                                      alt="Company Logo Preview"
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <Building2 className="h-6 w-6 text-amber-500/60" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                                    {aboutForm.companyLogoUrl ? "Custom Logo Active" : "Default Building Icon"}
                                  </p>
                                  <p className="text-[10px] font-mono text-[var(--muted-fg)] truncate">
                                    {aboutForm.companyLogoUrl || "No custom logo uploaded"}
                                  </p>
                                </div>
                              </div>

                              <div className="relative">
                                <input
                                  id="companyLogoUpload"
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingCompanyLogo}
                                  onChange={onCompanyLogoFileChange}
                                  className="block w-full text-xs text-[var(--muted-fg)] file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/15 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-amber-500/25 file:cursor-pointer file:transition-colors border border-[var(--border)] rounded-xl bg-[var(--background)] p-1.5 cursor-pointer"
                                />
                                {uploadingCompanyLogo && (
                                  <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <span>Uploading Logo to Cloudinary...</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Mini Header Preview */}
                            <div className="p-3 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)] flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 overflow-hidden p-0.5">
                                {aboutForm.companyLogoUrl ? (
                                  <img
                                    src={aboutForm.companyLogoUrl}
                                    alt="Company Logo Preview"
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <Building2 className="h-4 w-4" />
                                )}
                              </div>
                              <div className="leading-tight">
                                <span className="text-xs font-bold tracking-wider text-[var(--foreground)] uppercase block">
                                  {aboutForm.companyLine1 || "SPESHWAY"}
                                </span>
                                <span className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase block">
                                  {aboutForm.companyLine2 || "NAME"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Employee Identity & Personal Details */}
                          <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-amber-500" />
                                <span>2. Employee Identity &amp; Contact</span>
                              </h3>
                              <span className="text-[11px] text-[var(--muted-fg)]">Card credentials</span>
                            </div>

                            <div className="space-y-3.5">
                              <div className="space-y-1.5">
                                <Label htmlFor="fullName" className="text-xs font-semibold">
                                  Full Name (Printed on Card)
                                </Label>
                                <Input
                                  id="fullName"
                                  value={aboutForm.fullName}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, fullName: e.target.value }))
                                  }
                                  placeholder="JAYANTH SAI CHIKKALA"
                                  className="text-sm bg-[var(--background)] font-bold uppercase tracking-tight"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="designation" className="text-xs font-semibold">
                                  Job Designation / Role Title
                                </Label>
                                <Input
                                  id="designation"
                                  value={aboutForm.designation}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, designation: e.target.value }))
                                  }
                                  placeholder="ASSOCIATE SOFTWARE ENGINEER"
                                  className="text-sm bg-[var(--background)] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1.5">
                                  <Label htmlFor="mobile" className="text-xs font-semibold flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 text-amber-500" />
                                    <span>Mobile Number</span>
                                  </Label>
                                  <Input
                                    id="mobile"
                                    value={aboutForm.mobile}
                                    onChange={(e) =>
                                      setAboutForm((prev) => ({ ...prev, mobile: e.target.value }))
                                    }
                                    placeholder="+91 9010253076"
                                    className="text-xs sm:text-sm bg-[var(--background)] font-mono font-bold"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <Label htmlFor="bloodGroup" className="text-xs font-semibold flex items-center gap-1.5">
                                    <Droplets className="h-3.5 w-3.5 text-red-500" />
                                    <span>Blood Group</span>
                                  </Label>
                                  <Input
                                    id="bloodGroup"
                                    value={aboutForm.bloodGroup}
                                    onChange={(e) =>
                                      setAboutForm((prev) => ({ ...prev, bloodGroup: e.target.value }))
                                    }
                                    placeholder="O+"
                                    className="text-xs sm:text-sm bg-[var(--background)] font-mono font-bold"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Card Footer & QR Code Target */}
                          <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                                <QrCode className="h-4 w-4 text-amber-500" />
                                <span>3. Card Footer &amp; QR Code Target</span>
                              </h3>
                              <span className="text-[11px] text-[var(--muted-fg)]">Bottom banner</span>
                            </div>

                            <div className="space-y-3.5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label htmlFor="footerRole" className="text-xs font-semibold">
                                    Footer Badge Label
                                  </Label>
                                  <Input
                                    id="footerRole"
                                    value={aboutForm.footerRole}
                                    onChange={(e) =>
                                      setAboutForm((prev) => ({ ...prev, footerRole: e.target.value }))
                                    }
                                    placeholder="EMPLOYEE"
                                    className="text-xs sm:text-sm bg-[var(--background)] uppercase font-mono"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <Label htmlFor="footerDepartment" className="text-xs font-semibold">
                                    Department Name
                                  </Label>
                                  <Input
                                    id="footerDepartment"
                                    value={aboutForm.footerDepartment}
                                    onChange={(e) =>
                                      setAboutForm((prev) => ({ ...prev, footerDepartment: e.target.value }))
                                    }
                                    placeholder="SOFTWARE DEVELOPMENT"
                                    className="text-xs sm:text-sm bg-[var(--background)] uppercase font-bold"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="linkedinUrl" className="text-xs font-semibold flex items-center gap-1.5">
                                  <span>QR Code Target URL (LinkedIn / Profile Link)</span>
                                </Label>
                                <Input
                                  id="linkedinUrl"
                                  value={aboutForm.linkedinUrl}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                                  }
                                  placeholder="https://www.linkedin.com/in/jayanth-sai-chikkala/"
                                  className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                                />
                                <p className="text-[11px] text-[var(--muted-fg)]">
                                  Scanning the QR code on the ID card directly opens this URL on any smartphone camera.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column (5 cols): Photo Upload & Live ID Card Preview */}
                        <div className="lg:col-span-5 space-y-6">
                          {/* ID Card Photo (Cloudinary) */}
                          <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-amber-500" />
                                <span>ID Card Photo (Cloudinary)</span>
                              </h3>
                              <span className="text-[11px] text-[var(--muted-fg)]">Media</span>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)]">
                                <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden bg-zinc-900 border-2 border-amber-500 shadow-xs flex items-center justify-center">
                                  <img
                                    src={aboutForm.idCardPhotoUrl || "/id-avatar.webp"}
                                    alt="ID Avatar Preview"
                                    className="h-full w-full object-cover object-top"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                  <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                                    {aboutForm.idCardPhotoUrl.startsWith("http")
                                      ? "Uploaded to Cloudinary"
                                      : "Default Local (/id-avatar.webp)"}
                                  </p>
                                  <p className="text-[11px] font-mono text-[var(--muted-fg)] truncate">
                                    {aboutForm.idCardPhotoUrl}
                                  </p>
                                  {aboutForm.idCardPhotoPublicId && (
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                      ID: {aboutForm.idCardPhotoPublicId}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="idPhotoUpload" className="text-xs font-semibold">
                                  Upload New ID Card Photo
                                </Label>
                                <div className="relative">
                                  <input
                                    id="idPhotoUpload"
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingIdPhoto}
                                    onChange={onIdPhotoFileChange}
                                    className="block w-full text-xs text-[var(--muted-fg)] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/15 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-amber-500/25 file:cursor-pointer file:transition-colors border border-[var(--border)] rounded-xl bg-[var(--background)] p-1.5 cursor-pointer"
                                  />
                                  {uploadingIdPhoto && (
                                    <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                      <span>Uploading Photo to Cloudinary...</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-[11px] text-[var(--muted-fg)]">
                                  Square or portrait photos with clear face visibility look best inside the ID card frame.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Live ID Card Interactive Replica */}
                          <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                              <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                <span>Live ID Card Preview</span>
                              </h3>
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Real-time</span>
                            </div>

                            <div className="flex justify-center py-2">
                              {/* Realistic Physical ID Card Preview Replica */}
                              <div className="relative w-full max-w-[280px] bg-[var(--card-bg)] rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-[var(--border)] overflow-hidden select-none">
                                {/* Punch Hole */}
                                <div className="mx-auto mt-3.5 w-11 h-2 rounded-full bg-neutral-300/80 dark:bg-neutral-600/80 border border-neutral-400/80 dark:border-neutral-500/80 shadow-inner flex items-center justify-center">
                                  <div className="w-8 h-1 rounded-full bg-neutral-400/70 dark:bg-neutral-500/70" />
                                </div>

                                {/* Company Header */}
                                <div className="pt-2.5 px-4 flex items-center justify-center gap-2">
                                  <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 overflow-hidden p-0.5">
                                    {aboutForm.companyLogoUrl ? (
                                      <img
                                        src={aboutForm.companyLogoUrl}
                                        alt="Company Logo"
                                        className="h-full w-full object-contain"
                                      />
                                    ) : (
                                      <Building2 className="h-4.5 w-4.5" />
                                    )}
                                  </div>
                                  <div className="flex flex-col leading-none">
                                    <span className="text-[11px] font-bold tracking-wider text-[var(--foreground)] uppercase">
                                      {aboutForm.companyLine1 || "SPESHWAY"}
                                    </span>
                                    <span className="text-[12px] font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                                      {aboutForm.companyLine2 || "SOLUTIONS"}
                                    </span>
                                  </div>
                                </div>

                                {/* Photo Avatar */}
                                <div className="mt-3 flex justify-center">
                                  <div className="relative p-1 rounded-full border-2 border-amber-500 shadow-xs">
                                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-zinc-800">
                                      <img
                                        src={aboutForm.idCardPhotoUrl || "/id-avatar.webp"}
                                        alt="Preview Avatar"
                                        className="h-full w-full object-cover object-top"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Name & Designation */}
                                <div className="mt-2.5 text-center px-3">
                                  <h4 className="text-sm font-black text-[var(--foreground)] tracking-tight uppercase leading-tight line-clamp-1">
                                    {aboutForm.fullName || "JAYANTH SAI CHIKKALA"}
                                  </h4>
                                  <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 line-clamp-1">
                                    {aboutForm.designation || "ASSOCIATE SOFTWARE ENGINEER"}
                                  </p>
                                </div>

                                {/* Details */}
                                <div className="mt-2.5 px-4 space-y-1 text-[10px] font-mono">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[var(--foreground)] tracking-wider flex items-center gap-1 text-[9px]">
                                      <Phone className="h-2.5 w-2.5 text-amber-500" />
                                      MOBILE
                                    </span>
                                    <span className="font-black text-[var(--foreground)]">
                                      {aboutForm.mobile || "+91 9010253076"}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[var(--foreground)] tracking-wider flex items-center gap-1 text-[9px]">
                                      <Droplets className="h-2.5 w-2.5 text-red-500" />
                                      BLOOD GROUP
                                    </span>
                                    <span className="font-black text-[var(--foreground)]">
                                      {aboutForm.bloodGroup || "O+"}
                                    </span>
                                  </div>
                                </div>

                                {/* Card Footer Bar with QR code */}
                                <div className="mt-3.5 bg-gradient-to-r from-[#d97706] to-amber-500 px-3.5 py-2 flex items-center justify-between gap-2 overflow-hidden rounded-b-2xl">
                                  <div className="flex flex-col text-white min-w-0 flex-1 pr-1 justify-center">
                                    <span className="text-[7.5px] font-mono font-bold tracking-widest uppercase opacity-90 truncate leading-none mb-0.5">
                                      {aboutForm.footerRole || "EMPLOYEE"}
                                    </span>
                                    <span className="text-[9px] font-extrabold tracking-tight uppercase leading-snug break-words">
                                      {aboutForm.footerDepartment || "SOFTWARE DEVELOPMENT"}
                                    </span>
                                  </div>

                                  <div className="bg-white p-1 rounded shadow-xs shrink-0 flex items-center justify-center">
                                    <QRCodeSVG
                                      value={aboutForm.linkedinUrl || "https://www.linkedin.com/"}
                                      size={30}
                                      bgColor="#ffffff"
                                      fgColor="#171717"
                                      level="L"
                                      className="w-7 h-7"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: DEVELOPER CONSOLE / TERMINAL CONTENT */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <div>
                          <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span>B. Developer Console &amp; Terminal Content</span>
                          </h3>
                          <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                            Customize interactive Mac terminal commands, output text, capability lines, status, and CTA button.
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Terminal CMS</span>
                      </div>

                      {/* Header & Section Title Box */}
                      <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                          <h3 className="font-bold text-sm text-[var(--foreground)] flex items-center gap-2">
                            <TerminalIcon className="h-4 w-4 text-amber-500" />
                            <span>Developer Console Header &amp; Introduction</span>
                          </h3>
                          <span className="text-[11px] text-[var(--muted-fg)]">Terminal Banner</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="terminalBadge" className="text-xs font-semibold">
                              Top Badge Label
                            </Label>
                            <Input
                              id="terminalBadge"
                              value={aboutForm.terminalBadge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({ ...prev, terminalBadge: e.target.value }))
                              }
                              placeholder="Developer Console"
                              className="text-xs sm:text-sm bg-[var(--background)]"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="terminalHeading" className="text-xs font-semibold">
                              Section Main Heading
                            </Label>
                            <Input
                              id="terminalHeading"
                              value={aboutForm.terminalHeading}
                              onChange={(e) =>
                                setAboutForm((prev) => ({ ...prev, terminalHeading: e.target.value }))
                              }
                              placeholder="Building User-Centric, Scalable Solutions Across All Platforms"
                              className="text-xs sm:text-sm bg-[var(--background)] font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2-Column Grid for Terminal Commands and Output */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Whoami, About.md, Status */}
                        <div className="space-y-4">
                          {/* Command 1: $ whoami */}
                          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                                $ whoami
                              </span>
                              <span className="text-[10px] text-[var(--muted-fg)]">Command 1 Output</span>
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="terminalWhoami" className="text-xs font-semibold">
                                Whoami Response Output Line
                              </Label>
                              <Input
                                id="terminalWhoami"
                                value={aboutForm.terminalWhoami}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({ ...prev, terminalWhoami: e.target.value }))
                                }
                                placeholder="Jayanth Sai Chikkala — Associate Software Engineer"
                                className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                              />
                            </div>
                          </div>

                          {/* Command 2: $ cat about.md */}
                          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                                $ cat about.md
                              </span>
                              <span className="text-[10px] text-[var(--muted-fg)]">Command 2 Lines</span>
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <Label htmlFor="terminalAbout1" className="text-xs font-semibold">
                                  Line 1 (Summary Statement)
                                </Label>
                                <Input
                                  id="terminalAbout1"
                                  value={aboutForm.terminalAbout1}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalAbout1: e.target.value }))
                                  }
                                  placeholder="Building user-centric, high-impact digital applications across platforms."
                                  className="text-xs sm:text-sm bg-[var(--background)]"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="terminalAbout2" className="text-xs font-semibold">
                                  Line 2 (Passion / Vision Statement)
                                </Label>
                                <Input
                                  id="terminalAbout2"
                                  value={aboutForm.terminalAbout2}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalAbout2: e.target.value }))
                                  }
                                  placeholder="Passionate about transforming complex workflows into intuitive, resilient software."
                                  className="text-xs sm:text-sm bg-[var(--background)]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Command 4: $ echo $DEV_STATUS */}
                          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                                $ echo $DEV_STATUS
                              </span>
                              <span className="text-[10px] text-[var(--muted-fg)]">Command 4 Output</span>
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="terminalStatus" className="text-xs font-semibold">
                                Real-Time Availability Status Line
                              </Label>
                              <Input
                                id="terminalStatus"
                                value={aboutForm.terminalStatus}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({ ...prev, terminalStatus: e.target.value }))
                                }
                                placeholder="Available for New High-Impact Engineering Projects"
                                className="text-xs sm:text-sm bg-[var(--background)] font-mono text-amber-600 dark:text-amber-400 font-semibold"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Capabilities, Pills, CTA */}
                        <div className="space-y-4">
                          {/* Command 3: $ pnpm run capabilities */}
                          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                                $ pnpm run capabilities
                              </span>
                              <span className="text-[10px] text-[var(--muted-fg)]">Command 3 Lines</span>
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <Label htmlFor="terminalCapability1" className="text-[11px] text-[var(--muted-fg)]">
                                  Capability Line 1
                                </Label>
                                <Input
                                  id="terminalCapability1"
                                  value={aboutForm.terminalCapability1}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalCapability1: e.target.value }))
                                  }
                                  placeholder="Web Applications   — High-performance Next.js & React cloud systems"
                                  className="text-xs bg-[var(--background)] font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="terminalCapability2" className="text-[11px] text-[var(--muted-fg)]">
                                  Capability Line 2
                                </Label>
                                <Input
                                  id="terminalCapability2"
                                  value={aboutForm.terminalCapability2}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalCapability2: e.target.value }))
                                  }
                                  placeholder="Enterprise ERPs    — Scalable workflow engines & operational platforms"
                                  className="text-xs bg-[var(--background)] font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="terminalCapability3" className="text-[11px] text-[var(--muted-fg)]">
                                  Capability Line 3
                                </Label>
                                <Input
                                  id="terminalCapability3"
                                  value={aboutForm.terminalCapability3}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalCapability3: e.target.value }))
                                  }
                                  placeholder="Mobile Apps        — Cross-platform iOS & Android apps with fluid UX"
                                  className="text-xs bg-[var(--background)] font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="terminalCapability4" className="text-[11px] text-[var(--muted-fg)]">
                                  Capability Line 4
                                </Label>
                                <Input
                                  id="terminalCapability4"
                                  value={aboutForm.terminalCapability4}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalCapability4: e.target.value }))
                                  }
                                  placeholder="Desktop Apps       — Native-grade desktop tools built for stability"
                                  className="text-xs bg-[var(--background)] font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Quick Badges / Capability Pills & CTA */}
                          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                              <h4 className="font-bold text-xs text-[var(--foreground)]">
                                Capability Pills &amp; Call to Action
                              </h4>
                              <span className="text-[10px] text-[var(--muted-fg)]">Footer Elements</span>
                            </div>

                            <div className="space-y-3">
                              <Label className="text-xs font-semibold">Capability Highlight Pills</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <Input
                                  id="terminalPill1"
                                  value={aboutForm.terminalPill1}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalPill1: e.target.value }))
                                  }
                                  placeholder="⚡ Cloud-Native"
                                  className="text-xs bg-[var(--background)]"
                                />
                                <Input
                                  id="terminalPill2"
                                  value={aboutForm.terminalPill2}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalPill2: e.target.value }))
                                  }
                                  placeholder="🔒 Scalable ERP & Systems"
                                  className="text-xs bg-[var(--background)]"
                                />
                                <Input
                                  id="terminalPill3"
                                  value={aboutForm.terminalPill3}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalPill3: e.target.value }))
                                  }
                                  placeholder="🎯 Web • Mobile • Desktop"
                                  className="text-xs bg-[var(--background)]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]/60">
                              <div className="space-y-1.5">
                                <Label htmlFor="terminalCtaText" className="text-xs font-semibold">
                                  CTA Button Text
                                </Label>
                                <Input
                                  id="terminalCtaText"
                                  value={aboutForm.terminalCtaText}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalCtaText: e.target.value }))
                                  }
                                  placeholder="Get In Touch"
                                  className="text-xs sm:text-sm bg-[var(--background)] font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="terminalCtaUrl" className="text-xs font-semibold">
                                  CTA Target Link
                                </Label>
                                <Input
                                  id="terminalCtaUrl"
                                  value={aboutForm.terminalCtaUrl}
                                  onChange={(e) =>
                                    setAboutForm((prev) => ({ ...prev, terminalCtaUrl: e.target.value }))
                                  }
                                  placeholder="#contact"
                                  className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Save Action Card Bar */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-fg)]">
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[var(--foreground)]">Save About &amp; ID Badge Settings</p>
                          <p className="text-[11px]">All physical ID card credentials and terminal commands are persisted to MongoDB and synced live.</p>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={savingAbout || uploadingIdPhoto || uploadingCompanyLogo}
                        className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-8 py-3 shadow-md hover:shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer text-sm shrink-0"
                      >
                        {savingAbout ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            <span>Saving Changes to MongoDB...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1.5" />
                            <span>Save ID Card &amp; About Details</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

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
                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[var(--border)] text-[var(--muted-fg)]">
                      <FolderGit2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No projects added yet.</p>
                      <p className="text-xs text-[var(--muted-fg)] mt-1">
                        Projects stored in your MongoDB database will appear here.
                      </p>
                    </div>
                  ) : (
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
