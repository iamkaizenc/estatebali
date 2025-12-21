import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { passwordResetSchema, validateData } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

// POST /api/auth/reset-password - Reset password with token
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured. Please set up environment variables." },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Input validation
    const validation = validateData(passwordResetSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    // Look up the token in password_reset_tokens table
    const { data: tokenData, error: tokenLookupError } = await supabaseAdmin
      .from("password_reset_tokens")
      .select("user_id, expires_at, used")
      .eq("token", token)
      .single();

    if (tokenLookupError || !tokenData) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date(tokenData.expires_at) < new Date()) {
      // Delete expired token
      await supabaseAdmin
        .from("password_reset_tokens")
        .delete()
        .eq("token", token);

      return NextResponse.json(
        { success: false, error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if token has already been used
    if (tokenData.used) {
      return NextResponse.json(
        { success: false, error: "This reset token has already been used. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Determine which table to update (users or admin_users)
    // First check if user exists in users table
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", tokenData.user_id)
      .single();

    if (userData) {
      // Update password in users table
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ password_hash: passwordHash })
        .eq("id", tokenData.user_id);

      if (updateError) {
        logger.error("Error updating user password", updateError instanceof Error ? updateError : new Error(String(updateError)));
        throw updateError;
      }
    } else {
      // Check admin_users table
      const { data: adminData } = await supabaseAdmin
        .from("admin_users")
        .select("id")
        .eq("id", tokenData.user_id)
        .single();

      if (adminData) {
        // Update password in admin_users table
        const { error: updateError } = await supabaseAdmin
          .from("admin_users")
          .update({ password_hash: passwordHash })
          .eq("id", tokenData.user_id);

        if (updateError) {
          logger.error("Error updating admin password", updateError instanceof Error ? updateError : new Error(String(updateError)));
          throw updateError;
        }
      } else {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }
    }

    // Mark token as used
    await supabaseAdmin
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("token", token);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    logger.error("Reset password error", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}

