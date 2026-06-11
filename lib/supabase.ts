import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials for static export
// These are PUBLIC keys - safe to expose in frontend code
// Protected by RLS policies at database level
const SUPABASE_URL = 'https://uwnpifnkdqneafcaiyhz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XzBy5H98yapUKN1dO5qDIw_iq_UHNlV';

// Try to get from env first, fallback to hardcoded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

// Client for frontend use (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server/API use (service role key if available)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;

export type Database = any;
