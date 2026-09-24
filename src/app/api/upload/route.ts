import { NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let fileDataUri = "";
    let folder = "portfolio";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      fileDataUri = body.file;
      folder = body.folder || "portfolio";
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      folder = (formData.get("folder") as string) || "portfolio";

      if (!file) {
        return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mime = file.type || "image/jpeg";
      fileDataUri = `data:${mime};base64,${buffer.toString("base64")}`;
    } else {
      return NextResponse.json(
        { error: "Content-Type must be application/json or multipart/form-data." },
        { status: 400 }
      );
    }

    if (!fileDataUri) {
      return NextResponse.json({ error: "File data is required." }, { status: 400 });
    }

    const uploadResult = await uploadImageToCloudinary(fileDataUri, folder);

    return NextResponse.json({
      success: true,
      url: uploadResult.secureUrl,
      publicId: uploadResult.publicId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload image";
    console.error("Cloudinary upload route error:", message);
    return NextResponse.json(
      { error: message || "Failed to upload image to Cloudinary." },
      { status: 500 }
    );
  }
}
