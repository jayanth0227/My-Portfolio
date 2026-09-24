import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import { sendContactNotification } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    let savedToDb = false;
    let dbMessageId = null;

    // 1. Try persisting to MongoDB
    try {
      const conn = await connectToDatabase();
      if (conn) {
        const newMessage = await Message.create({
          name,
          email,
          subject: subject || "Portfolio Inquiry",
          message,
          status: "new",
        });
        savedToDb = true;
        dbMessageId = newMessage._id;
      }
    } catch (dbErr) {
      console.warn("MongoDB persistence skipped or failed:", dbErr);
    }

    // 2. Dispatch email notification via SMTP
    let emailSent = false;
    try {
      const mailResult = await sendContactNotification({
        name,
        email,
        subject,
        message,
      });
      emailSent = mailResult.success;
    } catch (mailErr) {
      console.warn("SMTP email delivery warning:", mailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been sent successfully.",
        savedToDb,
        emailSent,
        id: dbMessageId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to process contact inquiry. Please try again later." },
      { status: 500 }
    );
  }
}
