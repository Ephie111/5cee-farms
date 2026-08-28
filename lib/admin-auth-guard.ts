import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "./supabase-admin";

type VerifyResult =
  | { ok: true; callerId: string; callerRole: string }
  | { ok: false; status: number; error: string };

/**
 * Confirms the request's Authorization token belongs to a real,
 * currently-active Super Admin. Every sensitive admin-management route
 * calls this FIRST, before touching anything — this is what makes
 * "validate permissions on the backend, not just the frontend" actually
 * true, rather than just a comment in the code.
 */
export async function verifySuperAdminCaller(request: NextRequest): Promise<VerifyResult> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return { ok: false, status: 401, error: "Not authenticated." };
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(token);
  if (callerError || !callerData.user) {
    return { ok: false, status: 401, error: "Invalid session." };
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role, status")
    .eq("id", callerData.user.id)
    .single();

  if (!profile || profile.role !== "super_admin" || profile.status !== "active") {
    return { ok: false, status: 403, error: "Only active Super Admins can perform this action." };
  }

  return { ok: true, callerId: callerData.user.id, callerRole: profile.role };
}

export async function logAdminActivity(params: {
  actorAdminId: string | null;
  targetAdminId: string | null;
  action: string;
  details?: string;
}) {
  const supabaseAdmin = getSupabaseAdmin();
  await supabaseAdmin.from("admin_activity_log").insert({
    actor_admin_id: params.actorAdminId,
    target_admin_id: params.targetAdminId,
    action: params.action,
    details: params.details ?? null,
  });
}