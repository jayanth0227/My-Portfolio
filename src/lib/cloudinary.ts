import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface UploadMediaOptions {
  folder?: string;
  resourceType?: "auto" | "image" | "raw" | "video";
}

/**
 * Uploads a base64 or buffer media string (images, PDFs, videos, documents) to Cloudinary
 */
export async function uploadMediaToCloudinary(
  fileDataUri: string,
  options?: string | UploadMediaOptions
): Promise<CloudinaryUploadResult> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are not configured in environment variables.");
  }

  const folder = typeof options === "string" ? options : options?.folder || "portfolio";
  const explicitType = typeof options === "object" ? options?.resourceType : undefined;

  // Detect if PDF or non-image
  const isPdf = fileDataUri.startsWith("data:application/pdf") || fileDataUri.includes(".pdf");
  const resource_type = explicitType || (isPdf ? "auto" : "auto");

  // Only apply image transformations if not a PDF / raw document
  const uploadOptions: Record<string, unknown> = {
    folder,
    resource_type,
  };

  if (!isPdf && (!explicitType || explicitType === "image")) {
    uploadOptions.transformation = [{ quality: "auto", fetch_format: "auto" }];
  }

  const result: UploadApiResponse = await cloudinary.uploader.upload(fileDataUri, uploadOptions);

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

// Backward compatibility alias
export const uploadImageToCloudinary = uploadMediaToCloudinary;

/**
 * Deletes an asset by public ID
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return false;
  }
}

export default cloudinary;
