import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@portfolio.dev";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (
      email.toLowerCase().trim() === DEFAULT_ADMIN_EMAIL.toLowerCase().trim() &&
      password === DEFAULT_ADMIN_PASSWORD
    ) {
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
        user: { email: DEFAULT_ADMIN_EMAIL, role: "admin" },
      });
    }

    return NextResponse.json(
      { error: "Invalid credentials. Please check your email and password." },
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
