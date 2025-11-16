import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { registerSchema, validateData } from "@/lib/validation";
import { rateLimitByIP } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

// POST /api/auth/register - Register a new user
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured. Please set up environment variables." },
        { status: 503 }
      );
    }

    // Rate limiting
    const rateLimit = rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 5 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error || "Too many requests" },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Input validation
    const validation = validateData(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { email, password, name, phone } = validation.data;

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Check if email exists in admin_users table
    const { data: existingAdmin } = await supabaseAdmin
      .from("admin_users")
      .select("id, email")
      .eq("email", email)
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "This email is already registered as an admin" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in users table
    // Note: We need to add password_hash column to users table if it doesn't exist
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        email,
        name,
        phone: phone || null,
        password_hash: passwordHash,
        role: "customer", // Default role
        verified: false,
      })
      .select()
      .single();

    if (insertError) {
      // eslint-disable-next-line no-console
      console.error("Error creating user:", insertError);
      
      // If column doesn't exist, we need to add it
      if (insertError.message?.includes("column")) {
        const missingColumn = insertError.message.includes("password_hash") 
          ? "password_hash" 
          : insertError.message.includes("verified")
          ? "verified"
          : "unknown column";
        
        return NextResponse.json(
          { 
            success: false, 
            error: `Database schema needs to be updated. Please add ${missingColumn} column to users table. Run the migration: supabase/migrations/combined_migrations.sql` 
          },
          { status: 500 }
        );
      }
      
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    }, { status: 201 });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}

