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

    logger.debug('[Reset Password] Validating token', { 
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 8) + '...'
    });

    // Look up the token in password_reset_tokens table
    const { data: tokenData, error: tokenLookupError } = await supabaseAdmin
      .from("password_reset_tokens")
      .select("user_id, expires_at, used")
      .eq("token", token)
      .single();

    if (tokenLookupError) {
      logger.error('[Reset Password] Token lookup error', tokenLookupError instanceof Error ? tokenLookupError : new Error(String(tokenLookupError)), {
        errorCode: tokenLookupError.code,
        errorMessage: tokenLookupError.message
      });
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    if (!tokenData) {
      logger.warn('[Reset Password] Token not found', { tokenLength: token.length });
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    logger.debug('[Reset Password] Token found', { 
      userId: tokenData.user_id,
      expiresAt: tokenData.expires_at,
      used: tokenData.used
    });

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
    logger.debug('[Reset Password] Hashing new password');
    const passwordHash = await bcrypt.hash(password, 10);

    // Determine which table to update (users or admin_users)
    // First check if user exists in users table
    logger.debug('[Reset Password] Looking up user', { userId: tokenData.user_id });
    const { data: userData, error: userLookupError } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("id", tokenData.user_id)
      .single();

    if (userLookupError && userLookupError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is OK - we'll check admin_users
      logger.error("Error looking up user", userLookupError instanceof Error ? userLookupError : new Error(String(userLookupError)));
    }

    if (userData) {
      // Update password in users table
      logger.debug('[Reset Password] Updating user password', { userId: userData.id, email: userData.email });
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ password_hash: passwordHash })
        .eq("id", tokenData.user_id);

      if (updateError) {
        logger.error("Error updating user password", updateError instanceof Error ? updateError : new Error(String(updateError)), {
          userId: tokenData.user_id,
          errorCode: updateError.code,
          errorMessage: updateError.message
        });
        throw updateError;
      }
      logger.debug('[Reset Password] User password updated successfully');
    } else {
      // Check admin_users table
      logger.debug('[Reset Password] User not found in users table, checking admin_users');
      const { data: adminData, error: adminLookupError } = await supabaseAdmin
        .from("admin_users")
        .select("id, email")
        .eq("id", tokenData.user_id)
        .single();

      if (adminLookupError && adminLookupError.code !== 'PGRST116') {
        logger.error("Error looking up admin user", adminLookupError instanceof Error ? adminLookupError : new Error(String(adminLookupError)));
      }

      if (adminData) {
        // Update password in admin_users table
        logger.debug('[Reset Password] Updating admin password', { userId: adminData.id, email: adminData.email });
        const { error: updateError } = await supabaseAdmin
          .from("admin_users")
          .update({ password_hash: passwordHash })
          .eq("id", tokenData.user_id);

        if (updateError) {
          logger.error("Error updating admin password", updateError instanceof Error ? updateError : new Error(String(updateError)), {
            userId: tokenData.user_id,
            errorCode: updateError.code,
            errorMessage: updateError.message
          });
          throw updateError;
        }
        logger.debug('[Reset Password] Admin password updated successfully');
      } else {
        logger.error('[Reset Password] User not found in either table', { userId: tokenData.user_id });
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }
    }

    // Mark token as used
    logger.debug('[Reset Password] Marking token as used');
    const { error: markUsedError } = await supabaseAdmin
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("token", token);

    if (markUsedError) {
      logger.error("Error marking token as used", markUsedError instanceof Error ? markUsedError : new Error(String(markUsedError)));
      // Don't fail the request if marking as used fails - password is already updated
    }

    logger.debug('[Reset Password] Password reset completed successfully');
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

