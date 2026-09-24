import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : undefined;

  if (!user || !pass) {
    console.warn("SMTP credentials (SMTP_USER / SMTP_PASS) not configured. Emails will not be sent.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
  });
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: ContactEmailPayload) {
  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      message: "SMTP is not configured on the server. Message logged locally.",
    };
  }

  const senderFrom = process.env.SMTP_FROM || `"Portfolio Contact" <${process.env.SMTP_USER}>`;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
  const emailSubject = subject ? `Portfolio Message: ${subject}` : `New message from ${name} via Portfolio`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
      <h2 style="color: #38bdf8; margin-bottom: 8px;">📬 New Portfolio Contact Submission</h2>
      <p style="color: #94a3b8; font-size: 14px; margin-top: 0;">You received a new inquiry from your dynamic portfolio website.</p>
      
      <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Sender Name:</strong> <span style="color: #38bdf8;">${name}</span></p>
        <p style="margin: 0 0 10px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #818cf8; text-decoration: underline;">${email}</a></p>
        ${subject ? `<p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>` : ""}
        <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
        <div style="white-space: pre-wrap; color: #e2e8f0; background: #0f172a; padding: 12px; border-radius: 6px; border: 1px solid #334155;">${message}</div>
      </div>

      <footer style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center;">
        Sent automatically from your Next.js Portfolio on AWS Amplify Hosting.
      </footer>
    </div>
  `;

  const info = await transporter.sendMail({
    from: senderFrom,
    to: receiver,
    replyTo: email,
    subject: emailSubject,
    text: `New Portfolio Message from ${name} (${email}):\n\nSubject: ${subject || "None"}\n\n${message}`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}
