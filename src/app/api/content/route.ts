import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PortfolioContent, { DEFAULT_PORTFOLIO_CONTENT } from "@/models/PortfolioContent";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    let content = await PortfolioContent.findOne({ key: "home" }).lean();
    if (!content) {
      content = await PortfolioContent.findOne({}).lean();
    }

    if (!content) {
      return NextResponse.json({
        success: true,
        content: DEFAULT_PORTFOLIO_CONTENT,
        source: "default",
      });
    }

    return NextResponse.json(
      {
        success: true,
        content: {
          navbar: {
            brandName: content.navbar?.brandName || DEFAULT_PORTFOLIO_CONTENT.navbar.brandName,
          },
          hero: {
            badgeText: content.hero?.badgeText || DEFAULT_PORTFOLIO_CONTENT.hero.badgeText,
            titleLine1: content.hero?.titleLine1 || DEFAULT_PORTFOLIO_CONTENT.hero.titleLine1,
            titleLine2: content.hero?.titleLine2 || DEFAULT_PORTFOLIO_CONTENT.hero.titleLine2,
            description: content.hero?.description || DEFAULT_PORTFOLIO_CONTENT.hero.description,
            avatarUrl: content.hero?.avatarUrl || DEFAULT_PORTFOLIO_CONTENT.hero.avatarUrl,
            avatarPublicId: content.hero?.avatarPublicId || "",
            resumePdfUrl: content.hero?.resumePdfUrl || "",
            resumePdfPublicId: content.hero?.resumePdfPublicId || "",
            contactButtonText: content.hero?.contactButtonText || DEFAULT_PORTFOLIO_CONTENT.hero.contactButtonText,
            resumeButtonText: content.hero?.resumeButtonText || DEFAULT_PORTFOLIO_CONTENT.hero.resumeButtonText,
          },
          about: {
            companyLine1: content.about?.companyLine1 || DEFAULT_PORTFOLIO_CONTENT.about.companyLine1,
            companyLine2: content.about?.companyLine2 || DEFAULT_PORTFOLIO_CONTENT.about.companyLine2,
            companyLogoUrl: content.about?.companyLogoUrl || "",
            companyLogoPublicId: content.about?.companyLogoPublicId || "",
            idCardPhotoUrl: content.about?.idCardPhotoUrl || DEFAULT_PORTFOLIO_CONTENT.about.idCardPhotoUrl,
            idCardPhotoPublicId: content.about?.idCardPhotoPublicId || "",
            fullName: content.about?.fullName || DEFAULT_PORTFOLIO_CONTENT.about.fullName,
            designation: content.about?.designation || DEFAULT_PORTFOLIO_CONTENT.about.designation,
            mobile: content.about?.mobile || DEFAULT_PORTFOLIO_CONTENT.about.mobile,
            bloodGroup: content.about?.bloodGroup || DEFAULT_PORTFOLIO_CONTENT.about.bloodGroup,
            footerRole: content.about?.footerRole || DEFAULT_PORTFOLIO_CONTENT.about.footerRole,
            footerDepartment: content.about?.footerDepartment || DEFAULT_PORTFOLIO_CONTENT.about.footerDepartment,
            linkedinUrl: content.about?.linkedinUrl || DEFAULT_PORTFOLIO_CONTENT.about.linkedinUrl,
            terminalBadge: content.about?.terminalBadge || DEFAULT_PORTFOLIO_CONTENT.about.terminalBadge,
            terminalHeading: content.about?.terminalHeading || DEFAULT_PORTFOLIO_CONTENT.about.terminalHeading,
            terminalWhoami: content.about?.terminalWhoami || DEFAULT_PORTFOLIO_CONTENT.about.terminalWhoami,
            terminalAbout1: content.about?.terminalAbout1 || DEFAULT_PORTFOLIO_CONTENT.about.terminalAbout1,
            terminalAbout2: content.about?.terminalAbout2 || DEFAULT_PORTFOLIO_CONTENT.about.terminalAbout2,
            terminalCapability1: content.about?.terminalCapability1 || DEFAULT_PORTFOLIO_CONTENT.about.terminalCapability1,
            terminalCapability2: content.about?.terminalCapability2 || DEFAULT_PORTFOLIO_CONTENT.about.terminalCapability2,
            terminalCapability3: content.about?.terminalCapability3 || DEFAULT_PORTFOLIO_CONTENT.about.terminalCapability3,
            terminalCapability4: content.about?.terminalCapability4 || DEFAULT_PORTFOLIO_CONTENT.about.terminalCapability4,
            terminalStatus: content.about?.terminalStatus || DEFAULT_PORTFOLIO_CONTENT.about.terminalStatus,
            terminalPill1: content.about?.terminalPill1 || DEFAULT_PORTFOLIO_CONTENT.about.terminalPill1,
            terminalPill2: content.about?.terminalPill2 || DEFAULT_PORTFOLIO_CONTENT.about.terminalPill2,
            terminalPill3: content.about?.terminalPill3 || DEFAULT_PORTFOLIO_CONTENT.about.terminalPill3,
            terminalCtaText: content.about?.terminalCtaText || DEFAULT_PORTFOLIO_CONTENT.about.terminalCtaText,
            terminalCtaUrl: content.about?.terminalCtaUrl || DEFAULT_PORTFOLIO_CONTENT.about.terminalCtaUrl,
          },
          experience:
            Array.isArray(content.experience)
              ? content.experience
              : DEFAULT_PORTFOLIO_CONTENT.experience,
          contact: {
            badgeText: content.contact?.badgeText || DEFAULT_PORTFOLIO_CONTENT.contact.badgeText,
            titleLine1: content.contact?.titleLine1 || DEFAULT_PORTFOLIO_CONTENT.contact.titleLine1,
            titleLine2: content.contact?.titleLine2 || DEFAULT_PORTFOLIO_CONTENT.contact.titleLine2,
            description: content.contact?.description || DEFAULT_PORTFOLIO_CONTENT.contact.description,
            statusLabel: content.contact?.statusLabel || DEFAULT_PORTFOLIO_CONTENT.contact.statusLabel,
            statusText: content.contact?.statusText || DEFAULT_PORTFOLIO_CONTENT.contact.statusText,
            responseTime: content.contact?.responseTime || DEFAULT_PORTFOLIO_CONTENT.contact.responseTime,
            email: content.contact?.email || DEFAULT_PORTFOLIO_CONTENT.contact.email,
            phone: content.contact?.phone || DEFAULT_PORTFOLIO_CONTENT.contact.phone,
            location: content.contact?.location || DEFAULT_PORTFOLIO_CONTENT.contact.location,
            linkedinUrl: content.contact?.linkedinUrl || DEFAULT_PORTFOLIO_CONTENT.contact.linkedinUrl,
            githubUrl: content.contact?.githubUrl || DEFAULT_PORTFOLIO_CONTENT.contact.githubUrl,
            instagramUrl: content.contact?.instagramUrl || DEFAULT_PORTFOLIO_CONTENT.contact.instagramUrl,
            whatsappMessage: content.contact?.whatsappMessage || DEFAULT_PORTFOLIO_CONTENT.contact.whatsappMessage,
            resumePdfUrl: content.contact?.resumePdfUrl || "",
            resumePdfPublicId: content.contact?.resumePdfPublicId || "",
            avatarUrl: content.contact?.avatarUrl || DEFAULT_PORTFOLIO_CONTENT.contact.avatarUrl,
            avatarPublicId: content.contact?.avatarPublicId || "",
            dossierName: content.contact?.dossierName || DEFAULT_PORTFOLIO_CONTENT.contact.dossierName,
            dossierRole: content.contact?.dossierRole || DEFAULT_PORTFOLIO_CONTENT.contact.dossierRole,
            quickPrompts: Array.isArray(content.contact?.quickPrompts)
              ? content.contact.quickPrompts
              : DEFAULT_PORTFOLIO_CONTENT.contact.quickPrompts,
          },
        },
        source: "database",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error fetching portfolio content:", error);
    // Graceful fallback to default content so site is always functional
    return NextResponse.json(
      {
        success: true,
        content: DEFAULT_PORTFOLIO_CONTENT,
        source: "fallback",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
