export interface PortfolioContentData {
  navbar: {
    brandName: string;
  };
  hero: {
    badgeText: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    avatarUrl: string;
    avatarPublicId?: string;
    resumePdfUrl: string;
    resumePdfPublicId?: string;
    contactButtonText: string;
    resumeButtonText: string;
  };
  about: {
    companyLine1: string;
    companyLine2: string;
    companyLogoUrl?: string;
    companyLogoPublicId?: string;
    idCardPhotoUrl: string;
    idCardPhotoPublicId?: string;
    fullName: string;
    designation: string;
    mobile: string;
    bloodGroup: string;
    footerRole: string;
    footerDepartment: string;
    linkedinUrl: string;
    terminalBadge?: string;
    terminalHeading?: string;
    terminalWhoami?: string;
    terminalAbout1?: string;
    terminalAbout2?: string;
    terminalCapability1?: string;
    terminalCapability2?: string;
    terminalCapability3?: string;
    terminalCapability4?: string;
    terminalStatus?: string;
    terminalPill1?: string;
    terminalPill2?: string;
    terminalPill3?: string;
    terminalCtaText?: string;
    terminalCtaUrl?: string;
  };
}

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContentData = {
  navbar: {
    brandName: "Jayanth Sai Chikkala",
  },
  hero: {
    badgeText: "Available for New Projects",
    titleLine1: "Building Scalable",
    titleLine2: "Digital Experiences",
    description:
      "Java & Spring Boot Full Stack Developer crafting scalable, production-ready applications with modern frontend technologies, robust backend APIs, cloud infrastructure, and clean architecture.",
    avatarUrl: "/profile.png",
    avatarPublicId: "",
    resumePdfUrl: "",
    resumePdfPublicId: "",
    contactButtonText: "Get In Touch",
    resumeButtonText: "Download CV",
  },
  about: {
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
  },
};

