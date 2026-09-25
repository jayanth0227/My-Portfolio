import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (session !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        messages: [],
        note: "Database connection not configured or offline.",
      });
    }

    const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Admin messages fetch error:", error);
    return NextResponse.json({ messages: [] });
  }
}
