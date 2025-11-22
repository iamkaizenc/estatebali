import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { rateLimitByIP } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables on module load
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[Messages API] Missing required environment variables");
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 100 requests per minute per IP (higher for fetching messages)
    const rateLimit = rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 100 });
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
      console.error("[Messages API] Token validation error:", error);
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversation_id");

    // Input validation
    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json(
        { success: false, error: "Valid conversation ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is part of this conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("buyer_id, seller_id")
      .eq("id", conversationId)
      .single();

    if (!conversation || (conversation.buyer_id !== userId && conversation.seller_id !== userId)) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Get messages for this conversation
    const { data: messages, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id (
          id,
          name,
          email,
          avatar
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    // Mark messages as read
    const isBuyer = conversation.buyer_id === userId;
    await supabase
      .from("messages")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", userId)
      .eq("read", false);

    // Reset unread count for current user
    if (isBuyer) {
      await supabase
        .from("conversations")
        .update({ buyer_unread_count: 0 })
        .eq("id", conversationId);
    } else {
      await supabase
        .from("conversations")
        .update({ seller_unread_count: 0 })
        .eq("id", conversationId);
    }

    return NextResponse.json({
      success: true,
      messages: messages || [],
    });
  } catch (error: any) {
    console.error("Error in GET /api/messages:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 30 messages per minute per IP
    const rateLimit = rateLimitByIP(request, { windowMs: 60 * 1000, maxRequests: 30 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many messages. Please slow down." },
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
      console.error("[Messages API] Token validation error:", error);
      return NextResponse.json(
        { success: false, error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { conversation_id, content, receiver_id } = body;

    // Input validation
    if (!conversation_id || typeof conversation_id !== 'string') {
      return NextResponse.json(
        { success: false, error: "Valid conversation ID is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: "Message content is required" },
        { status: 400 }
      );
    }

    if (!receiver_id || typeof receiver_id !== 'string') {
      return NextResponse.json(
        { success: false, error: "Valid receiver ID is required" },
        { status: 400 }
      );
    }

    // Content validation
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Message too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is part of this conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("buyer_id, seller_id")
      .eq("id", conversation_id)
      .single();

    if (!conversation || (conversation.buyer_id !== userId && conversation.seller_id !== userId)) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Create message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id,
        sender_id: userId,
        receiver_id,
        content,
        read: false,
      })
      .select()
      .single();

    if (messageError) {
      console.error("Error creating message:", messageError);
      return NextResponse.json(
        { success: false, error: "Failed to send message" },
        { status: 500 }
      );
    }

    // Update conversation last_message and increment unread count
    const isBuyer = conversation.buyer_id === userId;
    const updateData: any = {
      last_message: content.substring(0, 100),
      last_message_at: new Date().toISOString(),
    };

    if (isBuyer) {
      // Buyer sent message, increment seller unread count
      updateData.seller_unread_count = supabase.rpc('increment', { row_id: conversation_id });
    } else {
      // Seller sent message, increment buyer unread count
      updateData.buyer_unread_count = supabase.rpc('increment', { row_id: conversation_id });
    }

    await supabase
      .from("conversations")
      .update(updateData)
      .eq("id", conversation_id);

    // Create notification for receiver
    await supabase.from("notifications").insert({
      user_id: receiver_id,
      title: "New Message",
      message: `You have a new message: ${content.substring(0, 50)}...`,
      type: "message",
      action_url: `/user/messages?conversation=${conversation_id}`,
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error: any) {
    console.error("Error in POST /api/messages:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
