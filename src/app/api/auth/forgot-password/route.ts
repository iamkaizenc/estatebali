import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { forgotPasswordSchema, validateData } from "@/lib/validation";
import { rateLimitByEmail } from "@/lib/rate-limit";
import { sendEmail, emailTemplates } from "@/lib/email";
import crypto from "crypto";

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured. Please set up environment variables." },
        { status: 503 }
      );
    }

    // Rate limiting (prevent email spam)
    const body = await request.json();
    
    const validation = validateData(forgotPasswordSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Rate limit by email (3 requests per hour)
    const rateLimit = rateLimitByEmail(email, { windowMs: 60 * 60 * 1000, maxRequests: 3 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error || "Too many password reset requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check if user exists
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("email", email)
      .single();

    // Also check admin_users
    const { data: adminUser } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, name")
      .eq("email", email)
      .single();

    // Don't reveal if user exists or not (security best practice)
    // But we'll still generate a token for valid emails
    const targetUser = user || adminUser;

    if (!targetUser) {
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Token expires in 1 hour

    // Store reset token in password_reset_tokens table
    // NOTE: This uses supabaseAdmin (service role) to bypass RLS policies
    // RLS Policy required: INSERT policy on password_reset_tokens table
    // Example: CREATE POLICY "Allow service role to insert reset tokens" ON password_reset_tokens
    //          FOR INSERT WITH CHECK (true);
    const { error: tokenError } = await supabaseAdmin
      .from("password_reset_tokens")
      .insert({
        user_id: targetUser.id,
        token: resetToken,
        expires_at: tokenExpiry.toISOString(),
        used: false,
      });

    if (tokenError) {
      // eslint-disable-next-line no-console
      console.error("Error storing reset token:", tokenError);
      
      // Check if this is an RLS (Row Level Security) issue
      if (tokenError.code === "42501" || 
          tokenError.message?.includes("row-level security") || 
          tokenError.message?.includes("policy")) {
        // eslint-disable-next-line no-console
        console.error("RLS Policy Error: password_reset_tokens table needs INSERT policy");
        // Still return success for security (don't reveal if user exists)
      }
      // In production, you should ensure the table exists and has proper RLS policies
    }

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send password reset email
    const emailTemplate = emailTemplates.passwordReset(resetUrl, targetUser.name || 'there');
    const emailResult = await sendEmail({
      to: targetUser.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    // Log email result (but don't fail if email fails - security best practice)
    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);

      // In development, still log the URL
      if (process.env.NODE_ENV === "development") {
        console.log("Password reset link (DEV ONLY):", resetUrl);
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
      // Only return URL in development if email failed
      devResetUrl: process.env.NODE_ENV === "development" && !emailResult.success ? resetUrl : undefined,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process password reset request" },
      { status: 500 }
    );
  }
}

