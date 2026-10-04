import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import connectToDatabase from "@/lib/mongodb";
import PortfolioContent from "@/models/PortfolioContent";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), "public", "resume.pdf");

    // 1. If local file exists, serve it directly
    if (fs.existsSync(publicPath)) {
      const fileBuffer = fs.readFileSync(publicPath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="Jayanth_Sai_Chikkala_Resume.pdf"',
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

    // 2. Fetch publicId or resume URL from MongoDB
    await connectToDatabase();
    const content = await PortfolioContent.findOne({ key: "home" }).lean();
    
    // Check contact and hero resume identifiers
    let publicId = content?.contact?.resumePdfPublicId || content?.hero?.resumePdfPublicId || "";
    const resumeUrl = content?.contact?.resumePdfUrl || content?.hero?.resumePdfUrl || "";

    // If publicId is empty, try extracting it from resumeUrl
    if (!publicId && resumeUrl) {
      const match = resumeUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
      if (match && match[1]) {
        publicId = match[1];
      }
    }

    if (!publicId) {
      publicId = "portfolio/resumes/jzuzekk8pz1sfqf8zewb";
    }

    // Clean publicId: remove .pdf extension and leading slash if present
    publicId = publicId.replace(/\.pdf$/i, "").replace(/^\/+/, "");

    // 3. Generate authenticated signed Cloudinary download URL to bypass Free tier delivery block
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const signedUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
      resource_type: "image",
      type: "upload",
    });

    const response = await fetch(signedUrl);

    if (!response.ok) {
      // Fallback 1: try raw resource type if image type fails
      const rawSignedUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
        resource_type: "raw",
        type: "upload",
      });
      const rawResponse = await fetch(rawSignedUrl);

      if (rawResponse.ok) {
        const rawBuffer = await rawResponse.arrayBuffer();
        try {
          fs.writeFileSync(publicPath, Buffer.from(rawBuffer));
        } catch {
          // Ignore cache write error in restricted environments
        }
        return new NextResponse(rawBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="Jayanth_Sai_Chikkala_Resume.pdf"',
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      // Fallback 2: try fetching direct resumeUrl if available
      if (resumeUrl && resumeUrl.startsWith("http")) {
        try {
          const directResponse = await fetch(resumeUrl);
          if (directResponse.ok) {
            const directBuffer = await directResponse.arrayBuffer();
            try {
              fs.writeFileSync(publicPath, Buffer.from(directBuffer));
            } catch {}
            return new NextResponse(directBuffer, {
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="Jayanth_Sai_Chikkala_Resume.pdf"',
                "Cache-Control": "public, max-age=3600",
              },
            });
          }
        } catch {
          // Fallback fetch error
        }
      }

      return NextResponse.json(
        { error: "Could not retrieve resume PDF from storage" },
        { status: 502 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    // Cache locally for ultra-fast subsequent responses
    try {
      fs.writeFileSync(publicPath, Buffer.from(arrayBuffer));
    } catch {
      // Ignore cache write error
    }

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Jayanth_Sai_Chikkala_Resume.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: unknown) {
    console.error("Resume route error:", error);
    return NextResponse.json(
      { error: "Failed to load resume PDF" },
      { status: 500 }
    );
  }
}
