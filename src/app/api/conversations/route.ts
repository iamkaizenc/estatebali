import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { rateLimitByIP } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables on module load
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[Conversations API] Missing required environment variables");
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 60 requests per minute per IP
    const rateLimit = rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 60 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Environment validation
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value || cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode JWT to get user_id with better error handling
    let userId: string;
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      if (!payload.userId) {
        throw new Error("Missing userId in token");
      }
      userId = payload.userId;
    } catch (error) {
      console.error("[Conversations API] Token validation error:", error);
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get conversations where user is either buyer or seller
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        property:properties (
          id,
          title,
          images,
          price,
          listing_type
        ),
        buyer:buyer_id (
          id,
          name,
          email,
          avatar
        ),
        seller:seller_id (
          id,
          name,
          email,
          avatar
        )
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .eq("status", "active")
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch conversations" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      conversations: conversations || [],
    });
  } catch (error: any) {
    console.error("Error in GET /api/conversations:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 conversation creations per 5 minutes per IP
    const rateLimit = rateLimitByIP(request, { windowMs: 5 * 60 * 1000, maxRequests: 10 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Environment validation
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value || cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode JWT to get user_id with better error handling
    let userId: string;
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      if (!payload.userId) {
        throw new Error("Missing userId in token");
      }
      userId = payload.userId;
    } catch (error) {
      console.error("[Conversations API] Token validation error:", error);
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { property_id, seller_id, initial_message } = body;

    // Input validation
    if (!seller_id || typeof seller_id !== 'string') {
      return NextResponse.json(
        { success: false, error: "Valid seller ID is required" },
        { status: 400 }
      );
    }

    if (initial_message && typeof initial_message !== 'string') {
      return NextResponse.json(
        { success: false, error: "Invalid message format" },
        { status: 400 }
      );
    }

    // Sanitize initial message length
    if (initial_message && initial_message.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Message too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    if (userId === seller_id) {
      return NextResponse.json(
        { success: false, error: "Cannot create conversation with yourself" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("buyer_id", userId)
      .eq("seller_id", seller_id)
      .eq("property_id", property_id)
      .single();

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        conversation: existingConversation,
        message: "Conversation already exists",
      });
    }

    // Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        property_id,
        buyer_id: userId,
        seller_id,
        last_message: initial_message || "Started a conversation",
        last_message_at: new Date().toISOString(),
        seller_unread_count: initial_message ? 1 : 0,
      })
      .select()
      .single();

    if (convError) {
      console.error("Error creating conversation:", convError);
      return NextResponse.json(
        { success: false, error: "Failed to create conversation" },
        { status: 500 }
      );
    }

    // If there's an initial message, create it
    if (initial_message) {
      await supabase.from("messages").insert({
        conversation_id: conversation.id,
        sender_id: userId,
        receiver_id: seller_id,
        content: initial_message,
        read: false,
      });
    }

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error: any) {
    console.error("Error in POST /api/conversations:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
