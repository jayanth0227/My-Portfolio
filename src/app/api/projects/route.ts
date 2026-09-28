import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { DEFAULT_PROJECTS } from "@/lib/projectDefaults";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        projects: DEFAULT_PROJECTS,
        source: "default",
        note: "Database connection not configured or offline.",
      });
    }

    const projects = await Project.find({})
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean();

    if (!projects || projects.length === 0) {
      return NextResponse.json({
        projects: DEFAULT_PROJECTS,
        source: "default",
      });
    }

    return NextResponse.json({ projects: projects || [], source: "database" });
  } catch (error) {
    console.error("Failed fetching projects from DB:", error);
    return NextResponse.json({ projects: DEFAULT_PROJECTS, source: "default" });
  }
}

export async function POST(request: Request) {
  try {
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

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Title, description, and imageUrl are required." },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: "Database connection unavailable. Please check MONGODB_URI in environment variables." },
        { status: 503 }
      );
    }

    const newProject = await Project.create({
      title,
      category: category || "Full-Stack",
      description,
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      imageUrl,
      cloudinaryPublicId: cloudinaryPublicId || "",
      liveUrl: liveUrl || "",
      githubUrl: githubUrl || "",
      featured: typeof featured === "boolean" ? featured : false,
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio project." },
      { status: 500 }
    );
  }
}
