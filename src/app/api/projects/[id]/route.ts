import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { DEFAULT_PROJECTS } from "@/lib/projectDefaults";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();
    if (!conn) {
      const defaultProj = DEFAULT_PROJECTS.find((p) => p._id === id);
      if (defaultProj) return NextResponse.json({ success: true, project: defaultProj });
      return NextResponse.json({ error: "Database offline" }, { status: 503 });
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      const project = await Project.findById(id).lean();
      if (project) {
        return NextResponse.json({ success: true, project });
      }
    }

    // Try finding by slug in MongoDB
    const projectBySlug = await Project.findOne({
      $or: [{ slug: id }, { _id: id }]
    }).lean();
    if (projectBySlug) {
      return NextResponse.json({ success: true, project: projectBySlug });
    }

    const defaultProj = DEFAULT_PROJECTS.find(
      (p) =>
        p._id === id ||
        p.slug === id ||
        (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === id)
    );
    if (defaultProj) {
      return NextResponse.json({ success: true, project: defaultProj });
    }

    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json({ error: "Failed to get project" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      category,
      description,
      tags,
      imageUrl,
      cloudinaryPublicId,
      liveUrl,
      githubUrl,
      featured,
      order,
    } = body;

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: "Database offline" }, { status: 503 });
    }

    const parsedTags: string[] = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = parsedTags;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (cloudinaryPublicId !== undefined) updateData.cloudinaryPublicId = cloudinaryPublicId;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (order !== undefined) updateData.order = Number(order);

    // 1. If valid MongoDB ObjectId, update directly
    if (mongoose.Types.ObjectId.isValid(id)) {
      const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).lean();

      if (updatedProject) {
        return NextResponse.json({ success: true, project: updatedProject });
      }
    }

    // 2. If it's a default ID (e.g. "default-2") or not yet in DB, create/upsert it
    const defaultTemplate = DEFAULT_PROJECTS.find((p) => p._id === id);
    const finalTags = tags !== undefined ? parsedTags : (defaultTemplate?.tags || []);

    const newProjectData = {
      title: title || defaultTemplate?.title || "Untitled Project",
      category: category || defaultTemplate?.category || "Full-Stack",
      description: description || defaultTemplate?.description || "Project description",
      tags: finalTags,
      imageUrl: imageUrl || defaultTemplate?.imageUrl || "/project-placeholder.jpg",
      cloudinaryPublicId: cloudinaryPublicId || defaultTemplate?.cloudinaryPublicId || "",
      liveUrl: liveUrl !== undefined ? liveUrl : (defaultTemplate?.liveUrl || ""),
      githubUrl: githubUrl !== undefined ? githubUrl : (defaultTemplate?.githubUrl || ""),
      featured: featured !== undefined ? Boolean(featured) : (defaultTemplate?.featured || false),
      order: order !== undefined ? Number(order) : (defaultTemplate?.order || 0),
    };

    if (newProjectData.title) {
      const existing = await Project.findOne({ title: newProjectData.title });
      if (existing) {
        const updated = await Project.findByIdAndUpdate(existing._id, updateData, {
          new: true,
          runValidators: true,
        }).lean();
        return NextResponse.json({ success: true, project: updated });
      }
    }

    const createdProject = await Project.create(newProjectData);
    return NextResponse.json({ success: true, project: createdProject });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: "Database offline" }, { status: 503 });
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      const deletedProject = await Project.findByIdAndDelete(id).lean();
      if (deletedProject) {
        return NextResponse.json({ success: true, message: "Project deleted successfully" });
      }
    }

    const defaultTemplate = DEFAULT_PROJECTS.find((p) => p._id === id);
    if (defaultTemplate) {
      await Project.deleteOne({ title: defaultTemplate.title });
      return NextResponse.json({ success: true, message: "Project deleted successfully" });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
