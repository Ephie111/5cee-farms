import { createClient } from "@supabase/supabase-js";

/**
 * ⚠️ SERVER-ONLY. Never import this file into any component that runs
 * in the browser (anything without "use server" context, i.e. no
 * "use client" files, no lib files used by client components).
 *
 * The service role key bypasses Row Level Security entirely — it can
 * read/write anything, and can create auth users directly. It's used
 * only inside app/api/admin/* route handlers, which run exclusively
 * on the server.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}