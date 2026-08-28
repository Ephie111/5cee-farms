import { supabase } from "./supabase";

export type AdminRole = "admin" | "super_admin";
export type AdminStatus = "active" | "pending_invitation" | "inactive" | "suspended" | "resigned";

export type AdminProfile = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
  invitedBy: string | null;
  invitedByName: string | null;
  invitedAt: string | null;
  activatedAt: string | null;
  lastLogin: string | null;
  deactivatedAt: string | null;
  suspendedAt: string | null;
  resignedAt: string | null;
  statusNote: string | null;
};

type AdminProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: AdminRole;
  status: AdminStatus;
  created_at: string;
  invited_by: string | null;
  invited_at: string | null;
  activated_at: string | null;
  last_login: string | null;
  deactivated_at: string | null;
  suspended_at: string | null;
  resigned_at: string | null;
  status_note: string | null;
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

async function authedFetch(path: string, body: object): Promise<any> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("You must be logged in.");

  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  const data = await parseJsonResponse(res);
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

/**
 * Every admin/super_admin account, with the full management
 * fields the Manage Admins table and detail page need. Relies on the
 * "Admins can view all profiles" RLS policy (only super admins actually
 * get to this page, enforced by AdminLayout + the route guards).
 */
export async function getAllAdmins(): Promise<AdminProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["admin", "super_admin"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllAdmins error:", error.message);
    return [];
  }

  const rows = data as AdminProfileRow[];

  // Resolve "invited by" names in a second pass (small admin lists, fine to do client-side)
  const inviterIds = Array.from(new Set(rows.map((r) => r.invited_by).filter(Boolean))) as string[];
  const inviterNames = new Map<string, string>();
  if (inviterIds.length > 0) {
    const { data: inviters } = await supabase.from("profiles").select("id, full_name").in("id", inviterIds);
    inviters?.forEach((i) => inviterNames.set(i.id, i.full_name ?? "—"));
  }

  return rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    invitedBy: row.invited_by,
    invitedByName: row.invited_by ? inviterNames.get(row.invited_by) ?? null : null,
    invitedAt: row.invited_at,
    activatedAt: row.activated_at,
    lastLogin: row.last_login,
    deactivatedAt: row.deactivated_at,
    suspendedAt: row.suspended_at,
    resignedAt: row.resigned_at,
    statusNote: row.status_note,
  }));
}

export async function getAdminById(id: string): Promise<AdminProfile | undefined> {
  const all = await getAllAdmins();
  return all.find((a) => a.id === id);
}

export type InviteAdminInput = { fullName: string; email: string; role: AdminRole };

/** Sends a new admin invitation. No password is ever set by the inviter. */
export async function inviteAdmin(input: InviteAdminInput): Promise<void> {
  await authedFetch("/api/admin/invite", input);
}

export async function resendInvitation(adminId: string): Promise<void> {
  await authedFetch("/api/admin/resend-invite", { adminId });
}

export async function cancelInvitation(adminId: string): Promise<void> {
  await authedFetch("/api/admin/cancel-invite", { adminId });
}

export async function changeAdminRole(adminId: string, newRole: AdminRole): Promise<void> {
  await authedFetch("/api/admin/change-role", { adminId, newRole });
}

export type StatusAction = "deactivate" | "reactivate" | "suspend" | "resign";

export async function setAdminStatus(adminId: string, action: StatusAction, note?: string): Promise<void> {
  await authedFetch("/api/admin/set-status", { adminId, action, note });
}