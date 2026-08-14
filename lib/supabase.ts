import { createClient } from "@supabase/supabase-js";

// These two values come from your Supabase project settings
// (Project Settings → API). They're safe to expose in the browser —
// that's what "public" / "anon" means here. Real security is enforced
// by Row Level Security (RLS) rules on each table, not by hiding this key.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);