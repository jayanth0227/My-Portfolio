import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        projects: [],
        note: "Database connection not configured or offline.",
      });
    }

    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ projects: projects || [] });
  } catch (error) {
    console.error("Failed fetching projects from DB:", error);
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, tags, imageUrl, liveUrl, githubUrl, featured, order } = body;

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
      description,
      tags: tags || [],
      imageUrl,
      liveUrl,
      githubUrl,
      featured: featured || false,
      order: order || 0,
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
