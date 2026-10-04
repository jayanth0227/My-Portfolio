import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import PortfolioContent, { DEFAULT_PORTFOLIO_CONTENT } from "@/models/PortfolioContent";

export const dynamic = "force-dynamic";

async function isAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET() {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    let content = await PortfolioContent.findOne({ key: "home" }).lean();
    if (!content) {
      content = await PortfolioContent.findOne({}).lean();
    }

    const responseContent = content
      ? {
          ...content,
          experience:
            Array.isArray(content.experience)
              ? content.experience
              : DEFAULT_PORTFOLIO_CONTENT.experience,
        }
      : DEFAULT_PORTFOLIO_CONTENT;

    return NextResponse.json(
      {
        success: true,
        content: responseContent,
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
    const message = error instanceof Error ? error.message : "Failed to load content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectToDatabase();

    const existing = (await PortfolioContent.findOne({ key: "home" }).lean()) || (await PortfolioContent.findOne({}).lean());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePayload: Record<string, any> = {
      key: "home",
    };

    if (body.navbar !== undefined) {
      updatePayload.navbar = {
        brandName: body.navbar?.brandName !== undefined ? body.navbar.brandName.trim() : (existing?.navbar?.brandName ?? DEFAULT_PORTFOLIO_CONTENT.navbar.brandName),
      };
    }

    if (body.hero !== undefined) {
      updatePayload.hero = {
        badgeText: body.hero?.badgeText !== undefined ? body.hero.badgeText.trim() : (existing?.hero?.badgeText ?? DEFAULT_PORTFOLIO_CONTENT.hero.badgeText),
        titleLine1: body.hero?.titleLine1 !== undefined ? body.hero.titleLine1.trim() : (existing?.hero?.titleLine1 ?? DEFAULT_PORTFOLIO_CONTENT.hero.titleLine1),
        titleLine2: body.hero?.titleLine2 !== undefined ? body.hero.titleLine2.trim() : (existing?.hero?.titleLine2 ?? DEFAULT_PORTFOLIO_CONTENT.hero.titleLine2),
        description: body.hero?.description !== undefined ? body.hero.description.trim() : (existing?.hero?.description ?? DEFAULT_PORTFOLIO_CONTENT.hero.description),
        avatarUrl: body.hero?.avatarUrl !== undefined ? body.hero.avatarUrl.trim() : (existing?.hero?.avatarUrl ?? DEFAULT_PORTFOLIO_CONTENT.hero.avatarUrl),
        avatarPublicId: body.hero?.avatarPublicId !== undefined ? body.hero.avatarPublicId : (existing?.hero?.avatarPublicId ?? ""),
        resumePdfUrl: body.hero?.resumePdfUrl !== undefined ? body.hero.resumePdfUrl.trim() : (existing?.hero?.resumePdfUrl ?? ""),
        resumePdfPublicId: body.hero?.resumePdfPublicId !== undefined ? body.hero.resumePdfPublicId : (existing?.hero?.resumePdfPublicId ?? ""),
        contactButtonText: body.hero?.contactButtonText !== undefined ? body.hero.contactButtonText.trim() : (existing?.hero?.contactButtonText ?? DEFAULT_PORTFOLIO_CONTENT.hero.contactButtonText),
        resumeButtonText: body.hero?.resumeButtonText !== undefined ? body.hero.resumeButtonText.trim() : (existing?.hero?.resumeButtonText ?? DEFAULT_PORTFOLIO_CONTENT.hero.resumeButtonText),
      };
    }

    if (body.about !== undefined) {
      updatePayload.about = {
        companyLine1: body.about?.companyLine1 !== undefined ? body.about.companyLine1.trim() : (existing?.about?.companyLine1 ?? DEFAULT_PORTFOLIO_CONTENT.about.companyLine1),
        companyLine2: body.about?.companyLine2 !== undefined ? body.about.companyLine2.trim() : (existing?.about?.companyLine2 ?? DEFAULT_PORTFOLIO_CONTENT.about.companyLine2),
        companyLogoUrl: body.about?.companyLogoUrl !== undefined ? body.about.companyLogoUrl.trim() : (existing?.about?.companyLogoUrl ?? ""),
        companyLogoPublicId: body.about?.companyLogoPublicId !== undefined ? body.about.companyLogoPublicId : (existing?.about?.companyLogoPublicId ?? ""),
        idCardPhotoUrl: body.about?.idCardPhotoUrl !== undefined ? body.about.idCardPhotoUrl.trim() : (existing?.about?.idCardPhotoUrl ?? DEFAULT_PORTFOLIO_CONTENT.about.idCardPhotoUrl),
        idCardPhotoPublicId: body.about?.idCardPhotoPublicId !== undefined ? body.about.idCardPhotoPublicId : (existing?.about?.idCardPhotoPublicId ?? ""),
        fullName: body.about?.fullName !== undefined ? body.about.fullName.trim() : (existing?.about?.fullName ?? DEFAULT_PORTFOLIO_CONTENT.about.fullName),
        designation: body.about?.designation !== undefined ? body.about.designation.trim() : (existing?.about?.designation ?? DEFAULT_PORTFOLIO_CONTENT.about.designation),
        mobile: body.about?.mobile !== undefined ? body.about.mobile.trim() : (existing?.about?.mobile ?? DEFAULT_PORTFOLIO_CONTENT.about.mobile),
        bloodGroup: body.about?.bloodGroup !== undefined ? body.about.bloodGroup.trim() : (existing?.about?.bloodGroup ?? DEFAULT_PORTFOLIO_CONTENT.about.bloodGroup),
        footerRole: body.about?.footerRole !== undefined ? body.about.footerRole.trim() : (existing?.about?.footerRole ?? DEFAULT_PORTFOLIO_CONTENT.about.footerRole),
        footerDepartment: body.about?.footerDepartment !== undefined ? body.about.footerDepartment.trim() : (existing?.about?.footerDepartment ?? DEFAULT_PORTFOLIO_CONTENT.about.footerDepartment),
        linkedinUrl: body.about?.linkedinUrl !== undefined ? body.about.linkedinUrl.trim() : (existing?.about?.linkedinUrl ?? DEFAULT_PORTFOLIO_CONTENT.about.linkedinUrl),
        terminalBadge: body.about?.terminalBadge !== undefined ? body.about.terminalBadge.trim() : (existing?.about?.terminalBadge ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalBadge),
        terminalHeading: body.about?.terminalHeading !== undefined ? body.about.terminalHeading.trim() : (existing?.about?.terminalHeading ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalHeading),
        terminalWhoami: body.about?.terminalWhoami !== undefined ? body.about.terminalWhoami.trim() : (existing?.about?.terminalWhoami ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalWhoami),
        terminalAbout1: body.about?.terminalAbout1 !== undefined ? body.about.terminalAbout1.trim() : (existing?.about?.terminalAbout1 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalAbout1),
        terminalAbout2: body.about?.terminalAbout2 !== undefined ? body.about.terminalAbout2.trim() : (existing?.about?.terminalAbout2 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalAbout2),
        terminalCapability1: body.about?.terminalCapability1 !== undefined ? body.about.terminalCapability1.trim() : (existing?.about?.terminalCapability1 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalCapability1),
        terminalCapability2: body.about?.terminalCapability2 !== undefined ? body.about.terminalCapability2.trim() : (existing?.about?.terminalCapability2 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalCapability2),
        terminalCapability3: body.about?.terminalCapability3 !== undefined ? body.about.terminalCapability3.trim() : (existing?.about?.terminalCapability3 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalCapability3),
        terminalCapability4: body.about?.terminalCapability4 !== undefined ? body.about.terminalCapability4.trim() : (existing?.about?.terminalCapability4 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalCapability4),
        terminalStatus: body.about?.terminalStatus !== undefined ? body.about.terminalStatus.trim() : (existing?.about?.terminalStatus ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalStatus),
        terminalPill1: body.about?.terminalPill1 !== undefined ? body.about.terminalPill1.trim() : (existing?.about?.terminalPill1 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalPill1),
        terminalPill2: body.about?.terminalPill2 !== undefined ? body.about.terminalPill2.trim() : (existing?.about?.terminalPill2 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalPill2),
        terminalPill3: body.about?.terminalPill3 !== undefined ? body.about.terminalPill3.trim() : (existing?.about?.terminalPill3 ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalPill3),
        terminalCtaText: body.about?.terminalCtaText !== undefined ? body.about.terminalCtaText.trim() : (existing?.about?.terminalCtaText ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalCtaText),
        terminalCtaUrl: body.about?.terminalCtaUrl !== undefined ? body.about.terminalCtaUrl.trim() : (existing?.about?.terminalCtaUrl ?? DEFAULT_PORTFOLIO_CONTENT.about.terminalCtaUrl),
      };
    }

    if (body.contact !== undefined) {
      updatePayload.contact = {
        badgeText: body.contact?.badgeText !== undefined ? body.contact.badgeText.trim() : (existing?.contact?.badgeText ?? DEFAULT_PORTFOLIO_CONTENT.contact.badgeText),
        titleLine1: body.contact?.titleLine1 !== undefined ? body.contact.titleLine1.trim() : (existing?.contact?.titleLine1 ?? DEFAULT_PORTFOLIO_CONTENT.contact.titleLine1),
        titleLine2: body.contact?.titleLine2 !== undefined ? body.contact.titleLine2.trim() : (existing?.contact?.titleLine2 ?? DEFAULT_PORTFOLIO_CONTENT.contact.titleLine2),
        description: body.contact?.description !== undefined ? body.contact.description.trim() : (existing?.contact?.description ?? DEFAULT_PORTFOLIO_CONTENT.contact.description),
        statusLabel: body.contact?.statusLabel !== undefined ? body.contact.statusLabel.trim() : (existing?.contact?.statusLabel ?? DEFAULT_PORTFOLIO_CONTENT.contact.statusLabel),
        statusText: body.contact?.statusText !== undefined ? body.contact.statusText.trim() : (existing?.contact?.statusText ?? DEFAULT_PORTFOLIO_CONTENT.contact.statusText),
        responseTime: body.contact?.responseTime !== undefined ? body.contact.responseTime.trim() : (existing?.contact?.responseTime ?? DEFAULT_PORTFOLIO_CONTENT.contact.responseTime),
        email: body.contact?.email !== undefined ? body.contact.email.trim() : (existing?.contact?.email ?? DEFAULT_PORTFOLIO_CONTENT.contact.email),
        phone: body.contact?.phone !== undefined ? body.contact.phone.trim() : (existing?.contact?.phone ?? DEFAULT_PORTFOLIO_CONTENT.contact.phone),
        location: body.contact?.location !== undefined ? body.contact.location.trim() : (existing?.contact?.location ?? DEFAULT_PORTFOLIO_CONTENT.contact.location),
        linkedinUrl: body.contact?.linkedinUrl !== undefined ? body.contact.linkedinUrl.trim() : (existing?.contact?.linkedinUrl ?? DEFAULT_PORTFOLIO_CONTENT.contact.linkedinUrl),
        githubUrl: body.contact?.githubUrl !== undefined ? body.contact.githubUrl.trim() : (existing?.contact?.githubUrl ?? DEFAULT_PORTFOLIO_CONTENT.contact.githubUrl),
        instagramUrl: body.contact?.instagramUrl !== undefined ? body.contact.instagramUrl.trim() : (existing?.contact?.instagramUrl ?? DEFAULT_PORTFOLIO_CONTENT.contact.instagramUrl),
        whatsappMessage: body.contact?.whatsappMessage !== undefined ? body.contact.whatsappMessage.trim() : (existing?.contact?.whatsappMessage ?? DEFAULT_PORTFOLIO_CONTENT.contact.whatsappMessage),
        resumePdfUrl: body.contact?.resumePdfUrl !== undefined ? body.contact.resumePdfUrl.trim() : (existing?.contact?.resumePdfUrl ?? ""),
        resumePdfPublicId: body.contact?.resumePdfPublicId !== undefined ? body.contact.resumePdfPublicId : (existing?.contact?.resumePdfPublicId ?? ""),
        avatarUrl: body.contact?.avatarUrl !== undefined ? body.contact.avatarUrl.trim() : (existing?.contact?.avatarUrl ?? DEFAULT_PORTFOLIO_CONTENT.contact.avatarUrl),
        avatarPublicId: body.contact?.avatarPublicId !== undefined ? body.contact.avatarPublicId : (existing?.contact?.avatarPublicId ?? ""),
        dossierName: body.contact?.dossierName !== undefined ? body.contact.dossierName.trim() : (existing?.contact?.dossierName ?? DEFAULT_PORTFOLIO_CONTENT.contact.dossierName),
        dossierRole: body.contact?.dossierRole !== undefined ? body.contact.dossierRole.trim() : (existing?.contact?.dossierRole ?? DEFAULT_PORTFOLIO_CONTENT.contact.dossierRole),
        quickPrompts: Array.isArray(body.contact?.quickPrompts)
          ? body.contact.quickPrompts.map((p: string) => String(p).trim()).filter(Boolean)
          : (existing?.contact?.quickPrompts ?? DEFAULT_PORTFOLIO_CONTENT.contact.quickPrompts),
      };
    }

    // Sync resume URL/PublicId across hero & contact sections if updated in either
    if (body.hero?.resumePdfUrl && !body.contact?.resumePdfUrl && updatePayload.hero) {
      if (!updatePayload.contact) {
        updatePayload.contact = { ...(existing?.contact || DEFAULT_PORTFOLIO_CONTENT.contact) };
      }
      updatePayload.contact.resumePdfUrl = updatePayload.hero.resumePdfUrl;
      updatePayload.contact.resumePdfPublicId = updatePayload.hero.resumePdfPublicId;
    } else if (body.contact?.resumePdfUrl && !body.hero?.resumePdfUrl && updatePayload.contact) {
      if (!updatePayload.hero) {
        updatePayload.hero = { ...(existing?.hero || DEFAULT_PORTFOLIO_CONTENT.hero) };
      }
      updatePayload.hero.resumePdfUrl = updatePayload.contact.resumePdfUrl;
      updatePayload.hero.resumePdfPublicId = updatePayload.contact.resumePdfPublicId;
    }

    if (body.experience !== undefined) {
      if (Array.isArray(body.experience)) {
        updatePayload.experience = body.experience.map((item: Record<string, unknown>, idx: number) => ({
          id: String(item.id || `exp-${Date.now()}-${idx}`),
          period: String(item.period || "").trim(),
          title: String(item.title || "").trim(),
          role: String(item.role || "").trim(),
          location: String(item.location || "").trim(),
          description: String(item.description || "").trim(),
          technologies: Array.isArray(item.technologies)
            ? item.technologies.map((t) => String(t).trim()).filter(Boolean)
            : typeof item.technologies === "string"
            ? (item.technologies as string)
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [],
          order: typeof item.order === "number" ? item.order : idx + 1,
        }));
      }
    }

    const updated = await PortfolioContent.findOneAndUpdate(
      { key: "home" },
      { $set: updatePayload },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio content updated successfully",
        content: updated,
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
    const message = error instanceof Error ? error.message : "Failed to update content";
    console.error("Admin content update error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
