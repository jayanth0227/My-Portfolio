import mongoose, { Schema, Model } from "mongoose";

export interface IProject {
  _id?: string;
  title: string;
  slug?: string;
  description: string;
  tags: string[];
  imageUrl: string;
  cloudinaryPublicId?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    liveUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent model overwrite in development hot reloading
const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
