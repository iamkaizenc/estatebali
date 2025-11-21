// Supabase Admin Client - Server-side only
// This file MUST NOT have "use client" directive
// Only use this in API routes, server components, or server actions

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('[Supabase Admin Init] Environment Check:', {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    nodeEnv: process.env.NODE_ENV,
  });
}

// Create admin client with detailed error handling
export const supabaseAdmin: SupabaseClient | null = (() => {
  if (!supabaseUrl) {
    console.error('[Supabase Admin] NEXT_PUBLIC_SUPABASE_URL is missing');
    return null;
  }

  if (!supabaseServiceKey) {
    console.error('[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY is missing');
    return null;
  }

  try {
    const client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('[Supabase Admin] Client created successfully');
    }
    return client;
  } catch (error: any) {
    console.error('[Supabase Admin] Error creating client:', error?.message || error);
    return null;
  }
})();

// Check if Supabase admin is configured
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseServiceKey;

