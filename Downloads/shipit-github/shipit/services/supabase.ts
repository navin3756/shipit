
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// In production, these are injected via environment variables.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "ShipIt: Supabase environment variables are missing. App will fallback to localStorage.\n" +
    "To enable the PostgreSQL backend, set SUPABASE_URL and SUPABASE_ANON_KEY."
  );
}

// Initialize with a dummy URL if missing to prevent the client from throwing on creation
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

/**
 * RECOMMENDED SQL FOR SUPABASE SQL EDITOR:
 * 
 * CREATE TABLE projects (
 *   id TEXT PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   source_type TEXT,
 *   tech_profile TEXT,
 *   repo_name TEXT,
 *   repo_owner TEXT,
 *   description TEXT,
 *   status TEXT,
 *   blueprint JSONB,
 *   expert_id TEXT,
 *   milestones JSONB,
 *   vault JSONB,
 *   artifacts JSONB,
 *   total_booking_cost NUMERIC
 * );
 */
