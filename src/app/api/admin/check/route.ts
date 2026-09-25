import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (session === "authenticated") {
    return NextResponse.json({
      authenticated: true,
      email: process.env.ADMIN_EMAIL || "admin@portfolio.dev",
    });
  }

  return NextResponse.json({ authenticated: false });
}
