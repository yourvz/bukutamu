import { createClient } from '@supabase/supabase-js';

// For static export/GitHub Pages, hardcode credentials as fallback
// These are public keys, safe to expose in frontend
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://uwnpifnkdqneafcaiyhz.supabase.co';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'sb_publishable_XzBy5H98yapUKN1dO5qDIw_iq_UHNlV';

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate that we have required credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

// Client for frontend use (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server/API use (with service role key - bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export type Database = any;
