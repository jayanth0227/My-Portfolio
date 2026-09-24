import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project, { IProject } from "@/models/Project";

const FALLBACK_PROJECTS: IProject[] = [
  {
    title: "AI-Powered Autonomous Analytics Platform",
    description: "Cloud-native data intelligence suite featuring real-time event streaming, dynamic visualization dashboards, and predictive trend modeling.",
    tags: ["Next.js", "TypeScript", "MongoDB", "AWS Amplify", "Node.js"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://example.com/demo1",
    githubUrl: "https://github.com/example/analytics-suite",
    featured: true,
    order: 1,
  },
  {
    title: "Enterprise Distributed Asset Engine",
    description: "High-performance digital asset pipeline with automated Cloudinary transformations, CDN edge replication, and fine-grained access control.",
    tags: ["Cloudinary", "Next.js", "AWS", "TailwindCSS", "REST APIs"],
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://example.com/demo2",
    githubUrl: "https://github.com/example/asset-engine",
    featured: true,
    order: 2,
  },
  {
    title: "Realtime Notification & Mail Hub",
    description: "Fault-tolerant messaging gateway integrating SMTP relays, queue workers, and automated receipt delivery with HTML rendering.",
    tags: ["SMTP", "Nodemailer", "TypeScript", "Docker", "Microservices"],
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://example.com/demo3",
    githubUrl: "https://github.com/example/mail-hub",
    featured: false,
    order: 3,
  },
];

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const dbProjects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
      if (dbProjects && dbProjects.length > 0) {
        return NextResponse.json({
          source: "database",
          projects: dbProjects,
        });
      }
    }

    // Return fallback sample projects if database is empty or unconfigured
    return NextResponse.json({
      source: "fallback",
      projects: FALLBACK_PROJECTS,
    });
  } catch (error) {
    console.warn("Failed fetching from DB, returning fallback sample data:", error);
    return NextResponse.json({
      source: "fallback",
      projects: FALLBACK_PROJECTS,
    });
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
