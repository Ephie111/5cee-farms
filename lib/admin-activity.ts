import { supabase } from "./supabase";

export type ActivityEntry = {
  id: string;
  actorName: string | null;
  targetName: string | null;
  action: string;
  details: string | null;
  createdAt: string;
};

type ActivityRow = {
  id: string;
  action: string;
  details: string | null;
  created_at: string;
  actor: { full_name: string | null } | null;
  target: { full_name: string | null } | null;
};

function mapRow(row: ActivityRow): ActivityEntry {
  return {
    id: row.id,
    actorName: row.actor?.full_name ?? null,
    targetName: row.target?.full_name ?? null,
    action: row.action,
    details: row.details,
    createdAt: row.created_at,
  };
}

/** The full activity log, most recent first. Super Admins only (enforced by RLS). */
export async function getActivityLog(limit = 100): Promise<ActivityEntry[]> {
  const { data, error } = await supabase
    .from("admin_activity_log")
    .select("id, action, details, created_at, actor:actor_admin_id(full_name), target:target_admin_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getActivityLog error:", error.message);
    return [];
  }
  return (data as unknown as ActivityRow[]).map(mapRow);
}

/** Activity where a specific admin was either the actor or the target. */
export async function getActivityForAdmin(adminId: string, limit = 50): Promise<ActivityEntry[]> {
  const { data, error } = await supabase
    .from("admin_activity_log")
    .select("id, action, details, created_at, actor:actor_admin_id(full_name), target:target_admin_id(full_name)")
    .or(`actor_admin_id.eq.${adminId},target_admin_id.eq.${adminId}`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getActivityForAdmin error:", error.message);
    return [];
  }
  return (data as unknown as ActivityRow[]).map(mapRow);
}