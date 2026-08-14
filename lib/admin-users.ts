import { supabase } from "./supabase";

export type AdminProfile = {
  id: string;
  fullName: string | null;
  email: string | null;
  createdAt: string;
};

/**
 * Parses a fetch response as JSON, but with a clear error message if it
 * isn't JSON at all — which happens when an API route path is wrong and
 * Next.js returns its HTML 404 page instead. Without this, that shows
 * up as a confusing "Unexpected token '<' ... is not valid JSON" error.
 */
async function parseJsonResponse(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Server returned an unexpected response (status ${res.status}). ` +
        `This usually means the API route file is missing or misplaced in the project.`
    );
  }
}

/** Everyone with role = "admin". Relies on the "Admins can view all profiles" RLS policy. */
export async function getAdminList(): Promise<AdminProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at")
    .eq("role", "admin")
    .order("created_at");

  if (error) {
    console.error("getAdminList error:", error.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at,
  }));
}

export type CreateAdminInput = {
  email: string;
  password: string;
  fullName: string;
};

/**
 * Creates a brand-new admin account directly (no customer signup step).
 * Calls the /api/admin/create-admin route, which does the real work
 * server-side using the service role key — this function just attaches
 * the current admin's own session token so the server can verify
 * they're actually allowed to do this.
 */
export async function createAdminAccount(input: CreateAdminInput): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("You must be logged in.");

  const res = await fetch("/api/admin/create-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to create admin account.");
  }
}

/** Revokes someone's admin access (demotes them back to "customer"). Their login still works, just with no admin privileges. */
export async function removeAdminAccess(targetUserId: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("You must be logged in.");

  const res = await fetch("/api/admin/remove-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetUserId }),
  });

  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to remove admin access.");
  }
}