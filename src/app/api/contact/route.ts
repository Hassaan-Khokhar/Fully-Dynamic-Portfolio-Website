import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate
    if (!name || !email || !subject || !message) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from("messages")
      .insert([{ name, email, subject, message }]);

    if (dbError) {
      console.error("Database error:", dbError);
    }

    // Only attempt to send email if Gmail credentials are provided
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // Create transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      // Email to site owner
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: "alihassaan435@gmail.com",
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; border: 1px solid #1a1a2e; border-radius: 16px; overflow: hidden;">
            <div style="padding: 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Portfolio Message</h1>
            </div>
            <div style="padding: 32px; color: #e0e0e0;">
              <p style="margin-bottom: 8px;"><strong style="color: #3b82f6;">Name:</strong> ${name}</p>
              <p style="margin-bottom: 8px;"><strong style="color: #3b82f6;">Email:</strong> ${email}</p>
              <p style="margin-bottom: 8px;"><strong style="color: #3b82f6;">Subject:</strong> ${subject}</p>
              <hr style="border: none; border-top: 1px solid #1a1a2e; margin: 24px 0;" />
              <p style="white-space: pre-wrap; line-height: 1.8;">${message}</p>
            </div>
            <div style="padding: 16px 32px; background: #050508; text-align: center; color: #555; font-size: 12px;">
              Sent from Hassaan Ali's Portfolio
            </div>
          </div>
        `,
      });
    } else {
      console.log("Skipping email delivery: GMAIL_USER or GMAIL_APP_PASSWORD not set in environment.");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
  }
}
