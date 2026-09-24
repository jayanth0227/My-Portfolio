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

/**
 * Uploads a base64 or buffer image string to Cloudinary
 */
export async function uploadImageToCloudinary(
  fileDataUri: string,
  folder: string = "portfolio"
): Promise<CloudinaryUploadResult> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are not configured in environment variables.");
  }

  const result: UploadApiResponse = await cloudinary.uploader.upload(fileDataUri, {
    folder,
    resource_type: "auto",
    transformation: [
      { quality: "auto", fetch_format: "auto" }
    ],
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

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
