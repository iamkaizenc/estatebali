// Supabase Admin Client - Server-side only
// This file MUST NOT have "use client" directive
// Only use this in API routes, server components, or server actions

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Always log to help debug (will show in Vercel Function Logs)
// eslint-disable-next-line no-console
console.log('[Supabase Admin Init] Environment Check:', {
  hasUrl: !!supabaseUrl,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 40)}...` : 'MISSING',
  hasServiceKey: !!supabaseServiceKey,
  serviceKeyPreview: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 40)}...` : 'MISSING',
  serviceKeyLength: supabaseServiceKey?.length || 0,
  nodeEnv: process.env.NODE_ENV,
});

// Create admin client with detailed error handling
export const supabaseAdmin: SupabaseClient | null = (() => {
  if (!supabaseUrl) {
    // eslint-disable-next-line no-console
    console.error('[Supabase Admin] ❌ ERROR: NEXT_PUBLIC_SUPABASE_URL is missing or empty');
    return null;
  }
  
  if (!supabaseServiceKey) {
    // eslint-disable-next-line no-console
    console.error('[Supabase Admin] ❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing or empty');
    // eslint-disable-next-line no-console
    console.error('[Supabase Admin] Available env vars with SUPABASE:', 
      Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    return null;
  }
  
  try {
    const client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    // eslint-disable-next-line no-console
    console.log('[Supabase Admin] ✅ Client created successfully');
    return client;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('[Supabase Admin] ❌ ERROR creating client:', error?.message || error);
    return null;
  }
})();

// Check if Supabase admin is configured
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseServiceKey;

