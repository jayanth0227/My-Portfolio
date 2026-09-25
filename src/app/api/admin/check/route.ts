import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEnvAdminCredentials } from "@/lib/adminAuth";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (session === "authenticated") {
    const creds = getEnvAdminCredentials();
    return NextResponse.json({
      authenticated: true,
      email: creds.email,
      username: creds.username,
    });
  }

  return NextResponse.json({ authenticated: false });
}
