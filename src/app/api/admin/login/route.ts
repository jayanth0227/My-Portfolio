import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminCredentials } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = body.email || body.username;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required." },
        { status: 400 }
      );
    }

    const authResult = await verifyAdminCredentials(identifier, password);

    if (authResult.valid && authResult.user) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({
        success: true,
        message: "Authentication successful.",
        user: authResult.user,
      });
    }

    return NextResponse.json(
      {
        error:
          authResult.error ||
          "Invalid credentials. Please check your email/username and password.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
