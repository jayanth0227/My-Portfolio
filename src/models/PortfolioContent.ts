import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolioContent extends Document {
  key: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioContentSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "home",
      index: true,
    },
    navbar: {
      brandName: {
        type: String,
        default: "Jayanth Sai Chikkala",
        trim: true,
      },
    },
    hero: {
      badgeText: {
        type: String,
        default: "Available for New Projects",
        trim: true,
      },
      titleLine1: {
        type: String,
        default: "Building Scalable",
        trim: true,
      },
      titleLine2: {
        type: String,
        default: "Digital Experiences",
        trim: true,
      },
      description: {
        type: String,
        default:
          "Java & Spring Boot Full Stack Developer crafting scalable, production-ready applications with modern frontend technologies, robust backend APIs, cloud infrastructure, and clean architecture.",
        trim: true,
      },
      avatarUrl: {
        type: String,
        default: "/profile.png",
      },
      avatarPublicId: {
        type: String,
        default: "",
      },
      resumePdfUrl: {
        type: String,
        default: "",
      },
      resumePdfPublicId: {
        type: String,
        default: "",
      },
      contactButtonText: {
        type: String,
        default: "Get In Touch",
      },
      resumeButtonText: {
        type: String,
        default: "Download CV",
      },
    },
    about: {
      companyLine1: {
        type: String,
        default: "SPESHWAY",
        trim: true,
      },
      companyLine2: {
        type: String,
        default: "SOLUTIONS",
        trim: true,
      },
      companyLogoUrl: {
        type: String,
        default: "",
      },
      companyLogoPublicId: {
        type: String,
        default: "",
      },
      idCardPhotoUrl: {
        type: String,
        default: "/id-avatar.webp",
      },
      idCardPhotoPublicId: {
        type: String,
        default: "",
      },
      fullName: {
        type: String,
        default: "JAYANTH SAI CHIKKALA",
        trim: true,
      },
      designation: {
        type: String,
        default: "ASSOCIATE SOFTWARE ENGINEER",
        trim: true,
      },
      mobile: {
        type: String,
        default: "+91 9010253076",
        trim: true,
      },
      bloodGroup: {
        type: String,
        default: "O+",
        trim: true,
      },
      footerRole: {
        type: String,
        default: "EMPLOYEE",
        trim: true,
      },
      footerDepartment: {
        type: String,
        default: "SOFTWARE DEVELOPMENT",
        trim: true,
      },
      linkedinUrl: {
        type: String,
        default: "https://www.linkedin.com/in/jayanth-sai-chikkala/",
        trim: true,
      },
      terminalBadge: {
        type: String,
        default: "Developer Console",
        trim: true,
      },
      terminalHeading: {
        type: String,
        default: "Building User-Centric, Scalable Solutions Across All Platforms",
        trim: true,
      },
      terminalWhoami: {
        type: String,
        default: "Jayanth Sai Chikkala — Associate Software Engineer",
        trim: true,
      },
      terminalAbout1: {
        type: String,
        default: "Building user-centric, high-impact digital applications across platforms.",
        trim: true,
      },
      terminalAbout2: {
        type: String,
        default: "Passionate about transforming complex workflows into intuitive, resilient software.",
        trim: true,
      },
      terminalCapability1: {
        type: String,
        default: "Web Applications   — High-performance Next.js & React cloud systems",
        trim: true,
      },
      terminalCapability2: {
        type: String,
        default: "Enterprise ERPs    — Scalable workflow engines & operational platforms",
        trim: true,
      },
      terminalCapability3: {
        type: String,
        default: "Mobile Apps        — Cross-platform iOS & Android apps with fluid UX",
        trim: true,
      },
      terminalCapability4: {
        type: String,
        default: "Desktop Apps       — Native-grade desktop tools built for stability",
        trim: true,
      },
      terminalStatus: {
        type: String,
        default: "Available for New High-Impact Engineering Projects",
        trim: true,
      },
      terminalPill1: {
        type: String,
        default: "⚡ Cloud-Native",
        trim: true,
      },
      terminalPill2: {
        type: String,
        default: "🔒 Scalable ERP & Systems",
        trim: true,
      },
      terminalPill3: {
        type: String,
        default: "🎯 Web • Mobile • Desktop",
        trim: true,
      },
      terminalCtaText: {
        type: String,
        default: "Get In Touch",
        trim: true,
      },
      terminalCtaUrl: {
        type: String,
        default: "#contact",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export { DEFAULT_PORTFOLIO_CONTENT } from "@/lib/contentDefaults";

const PortfolioContent: Model<IPortfolioContent> =
  mongoose.models.PortfolioContent ||
  mongoose.model<IPortfolioContent>("PortfolioContent", PortfolioContentSchema);

export default PortfolioContent;

