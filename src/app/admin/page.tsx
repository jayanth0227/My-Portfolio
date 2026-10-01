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
  Plus,
  Trash2,
  Pencil,
  X,
  Star,
  Globe,
  Code2,
  Tag,
  Layers,
  Briefcase,
  Calendar,
  MapPin,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  History,
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
import { ExperienceItem, DEFAULT_PORTFOLIO_CONTENT } from "@/lib/contentDefaults";

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
  category?: string;
  description: string;
  tags: string[];
  imageUrl: string;
  cloudinaryPublicId?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  order?: number;
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
  const [activeTab, setActiveTab] = useState<"content" | "about" | "experience" | "contact" | "messages" | "projects">("content");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Experience Timeline CMS State
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>(DEFAULT_PORTFOLIO_CONTENT.experience);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [experienceForm, setExperienceForm] = useState({
    period: "",
    title: "",
    role: "",
    location: "Hyderabad, India",
    description: "",
    technologiesInput: "",
    order: 1,
  });
  const [savingExperience, setSavingExperience] = useState(false);
  const [experienceSavedMessage, setExperienceSavedMessage] = useState<string | null>(null);
  const [experienceError, setExperienceError] = useState<string | null>(null);
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null);

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

  // Contact Module CMS State
  const [contactForm, setContactForm] = useState({
    badgeText: "GET IN TOUCH",
    titleLine1: "Let's Build Something",
    titleLine2: "Extraordinary",
    description:
      "Have an upcoming project, freelance inquiry, engineering role, or want to explore scalable architectures? Explore the interactive dossier on mobile or reach out directly.",
    statusLabel: "CURRENT STATUS",
    statusText: "Available for Full-time Roles & High-Impact Projects",
    responseTime: "Avg. response < 2h",
    email: "chikkalajayanthsai@gmail.com",
    phone: "+91 9010253076",
    location: "Hyderabad, India • Remote / Hybrid",
    linkedinUrl: "https://www.linkedin.com/in/jayanth-sai-chikkala/",
    githubUrl: "https://github.com/jayanthsaichikkala",
    instagramUrl: "https://www.instagram.com/",
    whatsappMessage: "Hi Jayanth, I saw your portfolio!",
    resumePdfUrl: "",
    resumePdfPublicId: "",
    avatarUrl: "/profile.png",
    avatarPublicId: "",
    dossierName: "Jayanth Sai Chikkala",
    dossierRole: "Associate Software Engineer",
    quickPromptsInput:
      "🚀 Discuss a new project, 💼 Full-time job opportunity, ☕ Coffee & tech chat, ⚡ Backend / Spring Boot consultation",
  });
  const [savingContact, setSavingContact] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const [contactSaveError, setContactSaveError] = useState<string | null>(null);
  const [uploadingContactAvatar, setUploadingContactAvatar] = useState(false);
  const [uploadingContactResume, setUploadingContactResume] = useState(false);
  const [contactUploadError, setContactUploadError] = useState<string | null>(null);

  // Project CMS State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Full-Stack",
    description: "",
    tagsInput: "",
    imageUrl: "",
    cloudinaryPublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    order: 0,
  });
  const [savingProject, setSavingProject] = useState(false);
  const [projectSavedMessage, setProjectSavedMessage] = useState<string | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);
  const [projectImageUploadError, setProjectImageUploadError] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const handleOpenCreateProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: "",
      category: "Full-Stack",
      description: "",
      tagsInput: "",
      imageUrl: "",
      cloudinaryPublicId: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: projects.length + 1,
    });
    setProjectError(null);
    setProjectImageUploadError(null);
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (project: ProjectItem) => {
    setEditingProjectId(project._id || null);
    setProjectForm({
      title: project.title,
      category: project.category || "Full-Stack",
      description: project.description,
      tagsInput: project.tags ? project.tags.join(", ") : "",
      imageUrl: project.imageUrl,
      cloudinaryPublicId: project.cloudinaryPublicId || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      featured: Boolean(project.featured),
      order: project.order ?? 0,
    });
    setProjectError(null);
    setProjectImageUploadError(null);
    setShowProjectModal(true);
  };

  const onProjectImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProjectImage(true);
    setProjectImageUploadError(null);
    try {
      const res = await handleUploadFile(file, "portfolio/projects");
      setProjectForm((prev) => ({
        ...prev,
        imageUrl: res.url,
        cloudinaryPublicId: res.publicId,
      }));
    } catch (err: unknown) {
      setProjectImageUploadError(
        err instanceof Error ? err.message : "Failed to upload project image to Cloudinary"
      );
    } finally {
      setUploadingProjectImage(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    setProjectError(null);

    try {
      if (!projectForm.title.trim()) {
        throw new Error("Project title is required");
      }
      if (!projectForm.description.trim()) {
        throw new Error("Project description is required");
      }
      if (!projectForm.imageUrl.trim()) {
        throw new Error("Project image is required (upload or enter URL)");
      }

      const tags = projectForm.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: projectForm.title.trim(),
        category: projectForm.category.trim() || "Full-Stack",
        description: projectForm.description.trim(),
        tags,
        imageUrl: projectForm.imageUrl.trim(),
        cloudinaryPublicId: projectForm.cloudinaryPublicId,
        liveUrl: projectForm.liveUrl.trim(),
        githubUrl: projectForm.githubUrl.trim(),
        featured: projectForm.featured,
        order: Number(projectForm.order) || 0,
      };

      const endpoint = editingProjectId
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save project");
      }

      await loadDashboardData();
      window.dispatchEvent(new Event("portfolio-projects-updated"));

      setProjectSavedMessage(
        editingProjectId
          ? "Project updated successfully!"
          : "New project created successfully!"
      );
      setTimeout(() => setProjectSavedMessage(null), 4000);
      setShowProjectModal(false);
    } catch (err: unknown) {
      setProjectError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setDeletingProjectId(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete project");
      }
      await loadDashboardData();
      window.dispatchEvent(new Event("portfolio-projects-updated"));
      setProjectSavedMessage("Project deleted successfully.");
      setTimeout(() => setProjectSavedMessage(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleToggleFeatured = async (project: ProjectItem) => {
    if (!project._id) return;
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        await loadDashboardData();
        window.dispatchEvent(new Event("portfolio-projects-updated"));
      }
    } catch (err) {
      console.error("Failed to toggle featured status:", err);
    }
  };

  // Experience CMS Handlers
  const handleOpenCreateExperience = () => {
    setEditingExpId(null);
    setExperienceForm({
      period: "",
      title: "",
      role: "",
      location: "Hyderabad, India",
      description: "",
      technologiesInput: "",
      order: experienceList.length + 1,
    });
    setExperienceError(null);
    setShowExperienceModal(true);
  };

  const handleOpenEditExperience = (exp: ExperienceItem) => {
    const expId = exp.id || (exp as unknown as { _id?: string })._id || "";
    setEditingExpId(expId);
    setExperienceForm({
      period: exp.period || "",
      title: exp.title || "",
      role: exp.role || "",
      location: exp.location || "",
      description: exp.description || "",
      technologiesInput: exp.technologies ? exp.technologies.join(", ") : "",
      order: exp.order ?? 1,
    });
    setExperienceError(null);
    setShowExperienceModal(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingExperience(true);
    setExperienceError(null);

    try {
      if (!experienceForm.role.trim()) {
        throw new Error("Job role is required");
      }
      if (!experienceForm.title.trim()) {
        throw new Error("Company / Organization title is required");
      }
      if (!experienceForm.period.trim()) {
        throw new Error("Date / Period is required");
      }
      if (!experienceForm.description.trim()) {
        throw new Error("Experience description is required");
      }

      const technologies = experienceForm.technologiesInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      let updatedList: ExperienceItem[];

      if (editingExpId) {
        updatedList = experienceList.map((item) => {
          const itemId = item.id || (item as unknown as { _id?: string })._id || "";
          if (itemId === editingExpId) {
            return {
              ...item,
              id: itemId,
              period: experienceForm.period.trim(),
              title: experienceForm.title.trim(),
              role: experienceForm.role.trim(),
              location: experienceForm.location.trim(),
              description: experienceForm.description.trim(),
              technologies,
              order: Number(experienceForm.order) || 1,
            };
          }
          return item;
        });
      } else {
        const newItem: ExperienceItem = {
          id: `exp-${Date.now()}`,
          period: experienceForm.period.trim(),
          title: experienceForm.title.trim(),
          role: experienceForm.role.trim(),
          location: experienceForm.location.trim(),
          description: experienceForm.description.trim(),
          technologies,
          order: Number(experienceForm.order) || experienceList.length + 1,
        };
        updatedList = [...experienceList, newItem];
      }

      // Sort by order
      updatedList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: updatedList }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save experience timeline");
      }

      setExperienceList(updatedList);
      window.dispatchEvent(new Event("portfolio-content-updated"));

      setExperienceSavedMessage(
        editingExpId
          ? "Experience item updated successfully!"
          : "New experience added successfully!"
      );
      setTimeout(() => setExperienceSavedMessage(null), 4000);
      setShowExperienceModal(false);
    } catch (err: unknown) {
      setExperienceError(err instanceof Error ? err.message : "Failed to save experience");
    } finally {
      setSavingExperience(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience entry?")) return;
    setDeletingExpId(id);
    try {
      const updatedList = experienceList.filter(
        (item) => (item.id || (item as unknown as { _id?: string })._id) !== id
      );
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: updatedList }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete experience");
      }

      setExperienceList(updatedList);
      window.dispatchEvent(new Event("portfolio-content-updated"));
      setExperienceSavedMessage("Experience entry deleted successfully.");
      setTimeout(() => setExperienceSavedMessage(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete experience");
    } finally {
      setDeletingExpId(null);
    }
  };

  const handleMoveExperience = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experienceList.length) return;

    const reordered = [...experienceList];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updatedList = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setExperienceList(updatedList);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: updatedList }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("portfolio-content-updated"));
      }
    } catch (err) {
      console.error("Failed to reorder experience items:", err);
    }
  };

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
          if (contentData.content.experience && Array.isArray(contentData.content.experience)) {
            setExperienceList(contentData.content.experience);
          } else {
            setExperienceList(DEFAULT_PORTFOLIO_CONTENT.experience);
          }

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

          if (contentData.content.contact) {
            const c = contentData.content.contact;
            setContactForm({
              badgeText: c.badgeText || "GET IN TOUCH",
              titleLine1: c.titleLine1 || "Let's Build Something",
              titleLine2: c.titleLine2 || "Extraordinary",
              description:
                c.description ||
                "Have an upcoming project, freelance inquiry, engineering role, or want to explore scalable architectures? Explore the interactive dossier on mobile or reach out directly.",
              statusLabel: c.statusLabel || "CURRENT STATUS",
              statusText: c.statusText || "Available for Full-time Roles & High-Impact Projects",
              responseTime: c.responseTime || "Avg. response < 2h",
              email: c.email || "chikkalajayanthsai@gmail.com",
              phone: c.phone || "+91 9010253076",
              location: c.location || "Hyderabad, India • Remote / Hybrid",
              linkedinUrl: c.linkedinUrl || "https://www.linkedin.com/in/jayanth-sai-chikkala/",
              githubUrl: c.githubUrl || "https://github.com/jayanthsaichikkala",
              instagramUrl: c.instagramUrl || "https://www.instagram.com/",
              whatsappMessage: c.whatsappMessage || "Hi Jayanth, I saw your portfolio!",
              resumePdfUrl: c.resumePdfUrl || "",
              resumePdfPublicId: c.resumePdfPublicId || "",
              avatarUrl: c.avatarUrl || "/profile.png",
              avatarPublicId: c.avatarPublicId || "",
              dossierName: c.dossierName || "Jayanth Sai Chikkala",
              dossierRole: c.dossierRole || "Associate Software Engineer",
              quickPromptsInput:
                c.quickPrompts && Array.isArray(c.quickPrompts)
                  ? c.quickPrompts.join(", ")
                  : "🚀 Discuss a new project, 💼 Full-time job opportunity, ☕ Coffee & tech chat, ⚡ Backend / Spring Boot consultation",
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

  const onContactAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingContactAvatar(true);
    setContactUploadError(null);
    try {
      const res = await handleUploadFile(file, "portfolio/contact");
      const updated = {
        ...contactForm,
        avatarUrl: res.url,
        avatarPublicId: res.publicId,
      };
      setContactForm(updated);

      const quickPrompts = updated.quickPromptsInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      // Auto-persist immediately to MongoDB
      const saveRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            ...updated,
            quickPrompts,
          },
        }),
      });

      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Uploaded to Cloudinary but failed to save to database");
      }

      setContactSaved(true);
      setTimeout(() => setContactSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setContactUploadError(err instanceof Error ? err.message : "Failed to upload contact portrait to Cloudinary");
    } finally {
      setUploadingContactAvatar(false);
    }
  };

  const onContactResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setContactUploadError("Please select a valid PDF file for the resume.");
      return;
    }
    setUploadingContactResume(true);
    setContactUploadError(null);
    try {
      const res = await handleUploadFile(file, "portfolio/resumes");
      const updated = {
        ...contactForm,
        resumePdfUrl: res.url,
        resumePdfPublicId: res.publicId,
      };
      setContactForm(updated);

      const quickPrompts = updated.quickPromptsInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      // Auto-persist immediately to MongoDB
      const saveRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            ...updated,
            quickPrompts,
          },
        }),
      });

      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Uploaded resume to Cloudinary but failed to save to database");
      }

      setContactSaved(true);
      setTimeout(() => setContactSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setContactUploadError(err instanceof Error ? err.message : "Failed to upload contact resume PDF to Cloudinary");
    } finally {
      setUploadingContactResume(false);
    }
  };

  const handleSaveContact = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingContact(true);
    setContactSaveError(null);
    setContactSaved(false);

    try {
      const quickPrompts = contactForm.quickPromptsInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      const payload = {
        contact: {
          badgeText: contactForm.badgeText,
          titleLine1: contactForm.titleLine1,
          titleLine2: contactForm.titleLine2,
          description: contactForm.description,
          statusLabel: contactForm.statusLabel,
          statusText: contactForm.statusText,
          responseTime: contactForm.responseTime,
          email: contactForm.email,
          phone: contactForm.phone,
          location: contactForm.location,
          linkedinUrl: contactForm.linkedinUrl,
          githubUrl: contactForm.githubUrl,
          instagramUrl: contactForm.instagramUrl,
          whatsappMessage: contactForm.whatsappMessage,
          resumePdfUrl: contactForm.resumePdfUrl,
          resumePdfPublicId: contactForm.resumePdfPublicId,
          avatarUrl: contactForm.avatarUrl,
          avatarPublicId: contactForm.avatarPublicId,
          dossierName: contactForm.dossierName,
          dossierRole: contactForm.dossierRole,
          quickPrompts,
        },
      };

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update Contact content");
      }

      setContactSaved(true);
      setTimeout(() => setContactSaved(false), 4500);
      window.dispatchEvent(new Event("portfolio-content-updated"));
    } catch (err: unknown) {
      setContactSaveError(err instanceof Error ? err.message : "Failed to save Contact content");
    } finally {
      setSavingContact(false);
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
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
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
      <main className="relative flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[var(--muted-fg)] font-medium">Inquiries</p>
                    <p className="text-xl sm:text-3xl font-extrabold text-[var(--foreground)] mt-1">
                      {messages.length}
                    </p>
                  </div>
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[var(--muted-fg)] font-medium">Projects</p>
                    <p className="text-xl sm:text-3xl font-extrabold text-[var(--foreground)] mt-1">
                      {projects.length}
                    </p>
                  </div>
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FolderGit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[var(--muted-fg)] font-medium">Experience</p>
                    <p className="text-xl sm:text-3xl font-extrabold text-[var(--foreground)] mt-1">
                      {experienceList.length}
                    </p>
                  </div>
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] sm:text-xs uppercase tracking-wider text-[var(--muted-fg)] font-medium">Gateway</p>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-1.5 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </p>
                  </div>
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  onClick={() => setActiveTab("experience")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "experience"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Experience Timeline ({experienceList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "contact"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Contact Module CMS</span>
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

              {/* Tab: Experience Timeline CMS */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  {/* Status Alerts */}
                  {experienceSavedMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3 shadow-xs"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-semibold">{experienceSavedMessage}</p>
                        <p className="text-xs opacity-90">Changes have been saved to MongoDB and are live on your portfolio timeline.</p>
                      </div>
                    </motion.div>
                  )}

                  {experienceError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{experienceError}</p>
                    </div>
                  )}

                  {/* Top Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-amber-500" />
                        <span>Experience Timeline Management</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-normal">
                          Live Sync
                        </span>
                      </h2>
                      <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                        Add, edit, reorder, and manage your career milestones with roles, companies, dates, and achievements.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={handleOpenCreateExperience}
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-4 py-2 text-xs sm:text-sm shadow-md hover:shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Experience</span>
                    </Button>
                  </div>



                  {/* Experience Items List */}
                  {experienceList.length === 0 ? (
                    <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--border)] text-[var(--muted-fg)] bg-[var(--card-bg)]/50">
                      <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-40 text-amber-500" />
                      <p className="text-sm font-bold text-[var(--foreground)]">No experience entries found.</p>
                      <p className="text-xs text-[var(--muted-fg)] mt-1 max-w-sm mx-auto">
                        Click &quot;Add New Experience&quot; above to create your first career timeline milestone.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {experienceList.map((exp, idx) => (
                        <div
                          key={exp.id || idx}
                          className="group rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-5 sm:p-6 shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all space-y-4"
                        >
                          {/* Card Top Meta */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/20">
                                #{idx + 1}
                              </span>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono text-xs font-semibold">
                                <Calendar className="h-3 w-3" />
                                <span>{exp.period}</span>
                              </div>
                              {exp.location && (
                                <div className="inline-flex items-center gap-1 text-xs text-[var(--muted-fg)]">
                                  <MapPin className="h-3 w-3 text-amber-500" />
                                  <span>{exp.location}</span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 self-end sm:self-auto">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleMoveExperience(idx, "up")}
                                disabled={idx === 0}
                                title="Move Up"
                                className="h-7 w-7 p-0 cursor-pointer disabled:opacity-30"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleMoveExperience(idx, "down")}
                                disabled={idx === experienceList.length - 1}
                                title="Move Down"
                                className="h-7 w-7 p-0 cursor-pointer disabled:opacity-30"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditExperience(exp)}
                                className="h-7 px-2.5 text-xs gap-1 cursor-pointer"
                              >
                                <Pencil className="h-3 w-3" />
                                <span>Edit</span>
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteExperience(
                                    exp.id || (exp as unknown as { _id?: string })._id || ""
                                  )
                                }
                                disabled={
                                  deletingExpId ===
                                  (exp.id || (exp as unknown as { _id?: string })._id)
                                }
                                className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-500/10 border-red-500/30 cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Role and Title */}
                          <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                              <span>{exp.role}</span>
                            </h3>
                            <div className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5" />
                              <span>{exp.title}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="text-xs sm:text-sm text-[var(--muted-fg)] leading-relaxed whitespace-pre-line bg-[var(--muted)]/40 p-3.5 rounded-xl border border-[var(--border)]/60">
                            {exp.description}
                          </div>

                          {/* Tech Stack Chips */}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {exp.technologies.map((t, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Contact Module CMS */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  {/* Status Alerts */}
                  {contactSaved && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3 shadow-xs"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-semibold">Contact Module Saved Successfully!</p>
                        <p className="text-xs opacity-90">
                          All contact details, social links, Cloudinary media assets, and status badges are synced live to MongoDB.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {contactSaveError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{contactSaveError}</p>
                    </div>
                  )}

                  {contactUploadError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{contactUploadError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSaveContact} className="space-y-6">
                    {/* Top Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs">
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                          <Mail className="h-4 w-4 text-amber-500" />
                          <span>Contact Module &amp; Dossier CMS</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-normal">
                            Live Sync
                          </span>
                        </h2>
                        <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                          Configure section headers, status pill, direct channels, Cloudinary portrait cutout &amp; resume PDF, dossier tags, and discussion topics.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={savingContact || uploadingContactAvatar || uploadingContactResume}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-6 shadow-md hover:shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto text-xs sm:text-sm"
                      >
                        {savingContact ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            <span>Saving to MongoDB...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1.5" />
                            <span>Save Contact Module</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Grid Section 1: Cloudinary Media Uploads (Portrait Cutout & Resume PDF) */}
                    <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-5">
                      <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-3.5">
                        <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <UploadCloud className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                            Cloudinary Media Assets
                          </h3>
                          <p className="text-xs text-[var(--muted-fg)]">
                            Upload your portrait cutout photo for the iPhone dossier and your official Resume PDF.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Contact Avatar Portrait */}
                        <div className="p-4 rounded-2xl bg-[var(--muted)]/40 border border-[var(--border)] space-y-3">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <ImageIcon className="h-3.5 w-3.5 text-amber-500" />
                              <span>iPhone Dossier Portrait Photo</span>
                            </span>
                            <span className="text-[10px] text-[var(--muted-fg)]">Cloudinary: portfolio/contact</span>
                          </Label>

                          <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-amber-400/40 bg-gradient-to-tr from-[#3b335c] via-[#201c34] to-[#4c3f76] flex items-end justify-center shrink-0 shadow-sm">
                              {contactForm.avatarUrl ? (
                                <img
                                  src={contactForm.avatarUrl}
                                  alt="Portrait Preview"
                                  className="h-full w-full object-contain object-bottom"
                                />
                              ) : (
                                <UserCheck className="h-8 w-8 text-amber-400 opacity-60 mb-2" />
                              )}
                            </div>

                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-colors">
                                  <UploadCloud className="h-3.5 w-3.5" />
                                  <span>{uploadingContactAvatar ? "Uploading to Cloudinary..." : "Upload New Photo"}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onContactAvatarFileChange}
                                    disabled={uploadingContactAvatar}
                                    className="hidden"
                                  />
                                </label>
                                {uploadingContactAvatar && (
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500" />
                                )}
                              </div>

                              <Input
                                value={contactForm.avatarUrl}
                                onChange={(e) =>
                                  setContactForm((prev) => ({ ...prev, avatarUrl: e.target.value }))
                                }
                                placeholder="Or enter direct image URL"
                                className="text-xs bg-[var(--background)] font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Resume PDF Upload */}
                        <div className="p-4 rounded-2xl bg-[var(--muted)]/40 border border-[var(--border)] space-y-3">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-amber-500" />
                              <span>Official Resume PDF Document</span>
                            </span>
                            <span className="text-[10px] text-[var(--muted-fg)]">Cloudinary: portfolio/resumes</span>
                          </Label>

                          <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-[var(--border)] bg-amber-500/10 text-amber-600 dark:text-amber-400 flex flex-col items-center justify-center shrink-0 shadow-sm">
                              {contactForm.resumePdfUrl ? (
                                <>
                                  <FileCheck className="h-7 w-7 text-emerald-500 mb-1" />
                                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">PDF Ready</span>
                                </>
                              ) : (
                                <>
                                  <FileText className="h-7 w-7 opacity-60 mb-1" />
                                  <span className="text-[9px] font-medium text-[var(--muted-fg)]">No PDF</span>
                                </>
                              )}
                            </div>

                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-colors">
                                  <FileUp className="h-3.5 w-3.5" />
                                  <span>{uploadingContactResume ? "Uploading PDF..." : "Upload Resume PDF"}</span>
                                  <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={onContactResumeFileChange}
                                    disabled={uploadingContactResume}
                                    className="hidden"
                                  />
                                </label>
                                {uploadingContactResume && (
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500" />
                                )}
                                {contactForm.resumePdfUrl && (
                                  <a
                                    href={contactForm.resumePdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                                  >
                                    <span>Preview</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>

                              <Input
                                value={contactForm.resumePdfUrl}
                                onChange={(e) =>
                                  setContactForm((prev) => ({ ...prev, resumePdfUrl: e.target.value }))
                                }
                                placeholder="Or enter direct PDF URL"
                                className="text-xs bg-[var(--background)] font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grid Section 2: Section Header & Intro Texts */}
                    <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-3">
                        <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                            Section Header &amp; Intro Badge
                          </h3>
                          <p className="text-xs text-[var(--muted-fg)]">
                            Customize the main headline and introduction description of the contact section.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="contactBadge" className="text-xs font-semibold">
                            Pill Badge Text
                          </Label>
                          <Input
                            id="contactBadge"
                            value={contactForm.badgeText}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, badgeText: e.target.value }))
                            }
                            placeholder="GET IN TOUCH"
                            className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="contactTitleLine1" className="text-xs font-semibold">
                            Title (Line 1)
                          </Label>
                          <Input
                            id="contactTitleLine1"
                            value={contactForm.titleLine1}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, titleLine1: e.target.value }))
                            }
                            placeholder="Let's Build Something"
                            className="text-xs sm:text-sm bg-[var(--background)]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="contactTitleLine2" className="text-xs font-semibold">
                            Gradient Highlight (Line 2)
                          </Label>
                          <Input
                            id="contactTitleLine2"
                            value={contactForm.titleLine2}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, titleLine2: e.target.value }))
                            }
                            placeholder="Extraordinary"
                            className="text-xs sm:text-sm bg-[var(--background)] font-semibold text-amber-600 dark:text-amber-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="contactDesc" className="text-xs font-semibold">
                          Description Paragraph
                        </Label>
                        <textarea
                          id="contactDesc"
                          rows={2}
                          value={contactForm.description}
                          onChange={(e) =>
                            setContactForm((prev) => ({ ...prev, description: e.target.value }))
                          }
                          placeholder="Have an upcoming project, freelance inquiry, engineering role..."
                          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs sm:text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:border-amber-500 leading-relaxed resize-y"
                        />
                      </div>
                    </div>

                    {/* Grid Section 3: Real-Time Availability & Status Banner */}
                    <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-3">
                        <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                            Live Availability Status Pill
                          </h3>
                          <p className="text-xs text-[var(--muted-fg)]">
                            Control the real-time availability indicator shown on the top right card of the contact section.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="contactStatusLabel" className="text-xs font-semibold">
                            Status Label
                          </Label>
                          <Input
                            id="contactStatusLabel"
                            value={contactForm.statusLabel}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, statusLabel: e.target.value }))
                            }
                            placeholder="CURRENT STATUS"
                            className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="contactStatusText" className="text-xs font-semibold">
                            Availability Text
                          </Label>
                          <Input
                            id="contactStatusText"
                            value={contactForm.statusText}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, statusText: e.target.value }))
                            }
                            placeholder="Available for Full-time Roles & High-Impact Projects"
                            className="text-xs sm:text-sm bg-[var(--background)]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="contactResponseTime" className="text-xs font-semibold">
                            Avg Response Time
                          </Label>
                          <Input
                            id="contactResponseTime"
                            value={contactForm.responseTime}
                            onChange={(e) =>
                              setContactForm((prev) => ({ ...prev, responseTime: e.target.value }))
                            }
                            placeholder="Avg. response < 2h"
                            className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Grid Section 4: Direct Channels & Dossier Settings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Direct Info Channels */}
                      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-3">
                          <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <Mail className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                              Direct Contact Channels
                            </h3>
                            <p className="text-xs text-[var(--muted-fg)]">
                              Direct email, telephone/WhatsApp, and location information.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="contactEmail" className="text-xs font-semibold">
                              Direct Email Address
                            </Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={contactForm.email}
                              onChange={(e) =>
                                setContactForm((prev) => ({ ...prev, email: e.target.value }))
                              }
                              placeholder="chikkalajayanthsai@gmail.com"
                              className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="contactPhone" className="text-xs font-semibold">
                              Phone / WhatsApp Number
                            </Label>
                            <Input
                              id="contactPhone"
                              value={contactForm.phone}
                              onChange={(e) =>
                                setContactForm((prev) => ({ ...prev, phone: e.target.value }))
                              }
                              placeholder="+91 9010253076"
                              className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="contactLocation" className="text-xs font-semibold">
                              Location &amp; Work Mode
                            </Label>
                            <Input
                              id="contactLocation"
                              value={contactForm.location}
                              onChange={(e) =>
                                setContactForm((prev) => ({ ...prev, location: e.target.value }))
                              }
                              placeholder="Hyderabad, India • Remote / Hybrid"
                              className="text-xs sm:text-sm bg-[var(--background)]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: iPhone Dossier Info & Social Links */}
                      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-3">
                          <div className="h-8 w-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Globe className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                              Dossier &amp; Social Links
                            </h3>
                            <p className="text-xs text-[var(--muted-fg)]">
                              iPhone Folder credentials and social network endpoints.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="dossierName" className="text-xs font-semibold">
                                Dossier Full Name
                              </Label>
                              <Input
                                id="dossierName"
                                value={contactForm.dossierName}
                                onChange={(e) =>
                                  setContactForm((prev) => ({ ...prev, dossierName: e.target.value }))
                                }
                                placeholder="Jayanth Sai Chikkala"
                                className="text-xs sm:text-sm bg-[var(--background)]"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="dossierRole" className="text-xs font-semibold">
                                Dossier Role
                              </Label>
                              <Input
                                id="dossierRole"
                                value={contactForm.dossierRole}
                                onChange={(e) =>
                                  setContactForm((prev) => ({ ...prev, dossierRole: e.target.value }))
                                }
                                placeholder="Associate Software Engineer"
                                className="text-xs sm:text-sm bg-[var(--background)]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="contactLinkedIn" className="text-xs font-semibold">
                              LinkedIn Profile URL
                            </Label>
                            <Input
                              id="contactLinkedIn"
                              value={contactForm.linkedinUrl}
                              onChange={(e) =>
                                setContactForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                              }
                              placeholder="https://www.linkedin.com/in/jayanth-sai-chikkala/"
                              className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="contactGitHub" className="text-xs font-semibold">
                              GitHub Profile URL
                            </Label>
                            <Input
                              id="contactGitHub"
                              value={contactForm.githubUrl}
                              onChange={(e) =>
                                setContactForm((prev) => ({ ...prev, githubUrl: e.target.value }))
                              }
                              placeholder="https://github.com/jayanthsaichikkala"
                              className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="contactWhatsAppMsg" className="text-xs font-semibold">
                              WhatsApp Pre-filled Message
                            </Label>
                            <Input
                              id="contactWhatsAppMsg"
                              value={contactForm.whatsappMessage}
                              onChange={(e) =>
                                setContactForm((prev) => ({ ...prev, whatsappMessage: e.target.value }))
                              }
                              placeholder="Hi Jayanth, I saw your portfolio!"
                              className="text-xs sm:text-sm bg-[var(--background)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grid Section 5: Quick Discussion Topics */}
                    <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-[var(--border)] pb-3">
                        <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                            Quick Discussion Starters
                          </h3>
                          <p className="text-xs text-[var(--muted-fg)]">
                            Interactive quick tags that open pre-filled inquiry emails with custom topics.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quickPromptsInput" className="text-xs font-semibold flex items-center justify-between">
                          <span>Topics (Comma-separated)</span>
                          <span className="text-[11px] text-[var(--muted-fg)] font-normal">e.g. 🚀 Discuss a new project, 💼 Full-time role</span>
                        </Label>
                        <Input
                          id="quickPromptsInput"
                          value={contactForm.quickPromptsInput}
                          onChange={(e) =>
                            setContactForm((prev) => ({ ...prev, quickPromptsInput: e.target.value }))
                          }
                          placeholder="🚀 Discuss a new project, 💼 Full-time job opportunity, ☕ Coffee & tech chat"
                          className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                        />
                      </div>

                      {/* Live Chips Preview */}
                      <div className="p-3.5 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)]/60 space-y-2">
                        <span className="text-[11px] font-semibold text-[var(--muted-fg)] uppercase tracking-wider">
                          Live Topics Preview:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {contactForm.quickPromptsInput
                            .split(",")
                            .map((p) => p.trim())
                            .filter(Boolean)
                            .map((prompt, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300"
                              >
                                {prompt}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Save Bar */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-fg)]">
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Check className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[var(--foreground)]">Save Contact Module Changes</p>
                          <p className="text-[11px]">All contact parameters, Cloudinary media, and discussion chips will be persisted to MongoDB.</p>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={savingContact || uploadingContactAvatar || uploadingContactResume}
                        className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-8 py-3 shadow-md hover:shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer text-sm shrink-0"
                      >
                        {savingContact ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            <span>Saving Changes to MongoDB...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1.5" />
                            <span>Save Contact Module Details</span>
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
                <div className="space-y-6">
                  {/* Status Alerts */}
                  {projectSavedMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3 shadow-xs"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-semibold">{projectSavedMessage}</p>
                        <p className="text-xs opacity-90">Changes have been saved to MongoDB and synced live to your portfolio.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Header & Add Project Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                        <span>Portfolio Projects CMS</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-normal">
                          {projects.length} Total Projects
                        </span>
                      </h2>
                      <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                        Manage your featured engineering projects, upload media screenshots to Cloudinary, and persist to MongoDB.
                      </p>
                    </div>

                    <Button
                      onClick={handleOpenCreateProject}
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-amber-500/25 transition-all text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Project</span>
                    </Button>
                  </div>



                  {/* Projects List Grid */}
                  {projects.length === 0 ? (
                    <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[var(--border)] text-[var(--muted-fg)] bg-[var(--card-bg)]/50">
                      <FolderGit2 className="h-10 w-10 mx-auto mb-3 opacity-40 text-amber-500" />
                      <p className="text-sm font-bold text-[var(--foreground)]">No projects added yet.</p>
                      <p className="text-xs text-[var(--muted-fg)] mt-1 max-w-sm mx-auto">
                        Click &quot;Add New Project&quot; above to add your first project with title, description, tech stack, and Cloudinary screenshot.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {projects.map((proj, idx) => (
                        <div
                          key={proj._id || idx}
                          className="group rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          {/* Card Image Banner */}
                          <div className="relative h-40 w-full overflow-hidden bg-zinc-900">
                            <img
                              src={proj.imageUrl || "/project-placeholder.jpg"}
                              alt={proj.title}
                              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                              {proj.featured ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 shadow-sm">
                                  <Star className="h-2.5 w-2.5 fill-zinc-950" />
                                  Featured
                                </span>
                              ) : (
                                <div />
                              )}

                              {proj.category && (
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 text-white/90 border border-white/10 backdrop-blur-sm">
                                  {proj.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Info */}
                          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-sm sm:text-base text-[var(--foreground)] line-clamp-1">
                                {proj.title}
                              </h3>
                              <p className="text-xs text-[var(--muted-fg)] line-clamp-2 mt-1 leading-relaxed">
                                {proj.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mt-3">
                                {proj.tags?.slice(0, 4).map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-fg)] border border-[var(--border)]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {(proj.tags?.length || 0) > 4 && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-[var(--muted-fg)]">
                                    +{(proj.tags?.length || 0) - 4}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Admin Actions */}
                            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                {proj.liveUrl && (
                                  <a
                                    href={proj.liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Live Demo"
                                    className="h-7 w-7 rounded-lg bg-[var(--muted)] hover:bg-amber-500 hover:text-zinc-950 flex items-center justify-center text-[var(--muted-fg)] transition-colors"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}
                                {proj.githubUrl && (
                                  <a
                                    href={proj.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="GitHub Source"
                                    className="h-7 w-7 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] flex items-center justify-center text-[var(--muted-fg)] transition-colors"
                                  >
                                    <Code2 className="h-3.5 w-3.5" />
                                  </a>
                                )}
                                {proj._id && (
                                  <button
                                    onClick={() => handleToggleFeatured(proj)}
                                    title={proj.featured ? "Unfeature" : "Mark as Featured"}
                                    className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                      proj.featured
                                        ? "text-amber-500 bg-amber-500/15"
                                        : "text-[var(--muted-fg)] hover:text-amber-500 bg-[var(--muted)]"
                                    }`}
                                  >
                                    <Star className={`h-3.5 w-3.5 ${proj.featured ? "fill-amber-500" : ""}`} />
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEditProject(proj)}
                                  className="h-7 px-2.5 text-xs gap-1 cursor-pointer"
                                >
                                  <Pencil className="h-3 w-3" />
                                  <span>Edit</span>
                                </Button>
                                {proj._id && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteProject(proj._id!)}
                                    disabled={deletingProjectId === proj._id}
                                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-500/10 border-red-500/30 cursor-pointer"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
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

      {/* ========================================================================= */}
      {/* Root Viewport Overlays (Modals mounted at root to prevent navbar clipping) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showExperienceModal && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setShowExperienceModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-amber-400/35 dark:border-amber-500/30 rounded-3xl shadow-2xl p-5 sm:p-6 my-auto max-h-[90vh] flex flex-col overflow-hidden"
            >
              <BorderBeam duration={8} size={140} colorFrom="#f59e0b" colorTo="#eab308" borderWidth={1.5} />

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--foreground)]">
                      {editingExpId ? "Edit Experience Entry" : "Add New Experience Entry"}
                    </h3>
                    <p className="text-xs text-[var(--muted-fg)]">
                      {editingExpId ? "Update existing career details" : "Add a new role to your timeline"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExperienceModal(false)}
                  className="h-8 w-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveExperience} className="space-y-4 overflow-y-auto pr-1 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="expRole" className="text-xs font-semibold">
                      Job Role / Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expRole"
                      value={experienceForm.role}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({ ...prev, role: e.target.value }))
                      }
                      placeholder="e.g. Associate Software Engineer"
                      className="text-xs sm:text-sm bg-[var(--background)]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="expTitle" className="text-xs font-semibold">
                      Company / Organization <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expTitle"
                      value={experienceForm.title}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="e.g. Speshway Solutions"
                      className="text-xs sm:text-sm bg-[var(--background)]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="expPeriod" className="text-xs font-semibold">
                      Date / Period <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expPeriod"
                      value={experienceForm.period}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({ ...prev, period: e.target.value }))
                      }
                      placeholder="e.g. Jan 2024 – Present"
                      className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="expLocation" className="text-xs font-semibold">
                      Location
                    </Label>
                    <Input
                      id="expLocation"
                      value={experienceForm.location}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({ ...prev, location: e.target.value }))
                      }
                      placeholder="e.g. Hyderabad, India / Remote"
                      className="text-xs sm:text-sm bg-[var(--background)]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="expOrder" className="text-xs font-semibold">
                      Timeline Order
                    </Label>
                    <Input
                      id="expOrder"
                      type="number"
                      min="1"
                      value={experienceForm.order}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({ ...prev, order: Number(e.target.value) || 1 }))
                      }
                      placeholder="1"
                      className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expDesc" className="text-xs font-semibold flex items-center justify-between">
                    <span>Role Description &amp; Key Achievements <span className="text-red-500">*</span></span>
                    <span className="text-[11px] text-[var(--muted-fg)] font-normal">Supports multi-line bullet points</span>
                  </Label>
                  <textarea
                    id="expDesc"
                    rows={5}
                    value={experienceForm.description}
                    onChange={(e) =>
                      setExperienceForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Architected scalable microservices using Java and Spring Boot. Optimized PostgreSQL queries and built reactive Next.js frontends..."
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs sm:text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:border-amber-500 transition-all resize-y leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expTech" className="text-xs font-semibold flex items-center justify-between">
                    <span>Core Technologies &amp; Tools</span>
                    <span className="text-[11px] text-[var(--muted-fg)] font-normal">Comma-separated</span>
                  </Label>
                  <Input
                    id="expTech"
                    value={experienceForm.technologiesInput}
                    onChange={(e) =>
                      setExperienceForm((prev) => ({ ...prev, technologiesInput: e.target.value }))
                    }
                    placeholder="Java, Spring Boot, Next.js, TypeScript, PostgreSQL, Docker, REST APIs"
                    className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                  />
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowExperienceModal(false)}
                    className="text-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={savingExperience}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold text-xs px-5 cursor-pointer shadow-md hover:shadow-amber-500/25"
                  >
                    {savingExperience ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        <span>Saving to MongoDB...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        <span>{editingExpId ? "Update Experience" : "Save Experience"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProjectModal && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setShowProjectModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--border)] bg-[var(--muted)]/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <FolderGit2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                      {editingProjectId ? "Edit Project" : "Create New Project"}
                    </h3>
                    <p className="text-xs text-[var(--muted-fg)]">
                      {editingProjectId ? "Update project details and Cloudinary media." : "Add a project to showcase in your portfolio."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="h-8 w-8 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--muted-fg)] hover:text-[var(--foreground)] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveProject} className="p-5 sm:p-6 space-y-4 overflow-y-auto pr-1 flex-1">
                {projectError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{projectError}</span>
                  </div>
                )}

                {/* Project Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 space-y-1.5">
                    <Label htmlFor="projTitle" className="text-xs font-semibold">
                      Project Title *
                    </Label>
                    <Input
                      id="projTitle"
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Enterprise ERP & Platform"
                      className="text-xs sm:text-sm bg-[var(--background)]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1.5">
                    <Label htmlFor="projCategory" className="text-xs font-semibold">
                      Category
                    </Label>
                    <select
                      id="projCategory"
                      value={projectForm.category}
                      onChange={(e) =>
                        setProjectForm((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground)] focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Cloud & APIs">Cloud &amp; APIs</option>
                      <option value="Web Apps">Web Apps</option>
                      <option value="Backend">Backend</option>
                      <option value="Mobile Apps">Mobile Apps</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="projDesc" className="text-xs font-semibold">
                    Description *
                  </Label>
                  <textarea
                    id="projDesc"
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                    placeholder="Describe the architecture, key problems solved, and real-world impact..."
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-3 text-xs sm:text-sm text-[var(--foreground)] focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
                    required
                  />
                </div>

                {/* Tech Stack Tags Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="projTags" className="text-xs font-semibold flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-amber-500" />
                      <span>Tech Stack (Comma-Separated)</span>
                    </Label>
                    <span className="text-[10px] text-[var(--muted-fg)]">e.g. Java 21, Spring Boot, React, Next.js, Docker</span>
                  </div>
                  <Input
                    id="projTags"
                    value={projectForm.tagsInput}
                    onChange={(e) =>
                      setProjectForm((prev) => ({ ...prev, tagsInput: e.target.value }))
                    }
                    placeholder="Java 21, Spring Boot, Next.js, PostgreSQL, Docker"
                    className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                  />
                </div>

                {/* Cloudinary Project Image Upload */}
                <div className="space-y-2 p-4 rounded-2xl bg-[var(--muted)]/40 border border-[var(--border)]">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-amber-500" />
                    <span>Project Media Screenshot (Cloudinary) *</span>
                  </Label>

                  {projectImageUploadError && (
                    <p className="text-xs text-red-500">{projectImageUploadError}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Image Preview Thumbnail */}
                    {projectForm.imageUrl ? (
                      <div className="relative h-24 w-36 rounded-xl overflow-hidden border border-[var(--border)] bg-zinc-900 shrink-0">
                        <img
                          src={projectForm.imageUrl}
                          alt="Project Preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProjectForm((prev) => ({ ...prev, imageUrl: "", cloudinaryPublicId: "" }))
                          }
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 w-36 rounded-xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--muted-fg)] shrink-0 bg-[var(--background)]">
                        <ImageIcon className="h-6 w-6 opacity-40 mb-1" />
                        <span className="text-[10px]">No image yet</span>
                      </div>
                    )}

                    {/* Upload Controls */}
                    <div className="space-y-2 flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-colors">
                          <UploadCloud className="h-3.5 w-3.5" />
                          <span>
                            {uploadingProjectImage ? "Uploading to Cloudinary..." : "Upload Screenshot"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onProjectImageFileChange}
                            disabled={uploadingProjectImage}
                            className="hidden"
                          />
                        </label>
                        {uploadingProjectImage && (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[var(--muted-fg)]">Or provide direct Image URL:</span>
                        <Input
                          value={projectForm.imageUrl}
                          onChange={(e) =>
                            setProjectForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                          }
                          placeholder="https://images.unsplash.com/..."
                          className="text-xs bg-[var(--background)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* URLs: Live Demo & GitHub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="projLiveUrl" className="text-xs font-semibold flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-amber-500" />
                      <span>Live Demo URL</span>
                    </Label>
                    <Input
                      id="projLiveUrl"
                      value={projectForm.liveUrl}
                      onChange={(e) =>
                        setProjectForm((prev) => ({ ...prev, liveUrl: e.target.value }))
                      }
                      placeholder="https://yourproject.com"
                      className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="projGithubUrl" className="text-xs font-semibold flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-amber-500" />
                      <span>GitHub Repository URL</span>
                    </Label>
                    <Input
                      id="projGithubUrl"
                      value={projectForm.githubUrl}
                      onChange={(e) =>
                        setProjectForm((prev) => ({ ...prev, githubUrl: e.target.value }))
                      }
                      placeholder="https://github.com/user/repo"
                      className="text-xs sm:text-sm bg-[var(--background)] font-mono"
                    />
                  </div>
                </div>

                {/* Featured & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-[var(--muted)]/40 border border-[var(--border)]">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={(e) =>
                        setProjectForm((prev) => ({ ...prev, featured: e.target.checked }))
                      }
                      className="h-4 w-4 rounded-sm border-[var(--border)] text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>Featured Project</span>
                      </span>
                      <p className="text-[10px] text-[var(--muted-fg)]">Highlight at top of portfolio</p>
                    </div>
                  </label>

                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="projOrder" className="text-xs font-semibold">
                      Display Order:
                    </Label>
                    <Input
                      id="projOrder"
                      type="number"
                      value={projectForm.order}
                      onChange={(e) =>
                        setProjectForm((prev) => ({ ...prev, order: Number(e.target.value) }))
                      }
                      className="w-20 text-xs bg-[var(--background)] text-center font-mono"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProjectModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={savingProject || uploadingProjectImage}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-6 text-xs cursor-pointer"
                  >
                    {savingProject ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        <span>Saving to MongoDB...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        <span>{editingProjectId ? "Update Project" : "Save Project"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
