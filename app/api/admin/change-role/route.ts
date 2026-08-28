import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifySuperAdminCaller, logAdminActivity } from "@/lib/admin-auth-guard";

const VALID_ROLES = ["admin", "super_admin"];

export async function POST(request: NextRequest) {
  const auth = await verifySuperAdminCaller(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { adminId, newRole } = await request.json();
  if (!adminId || !VALID_ROLES.includes(newRole)) {
    return NextResponse.json({ error: "Missing adminId or invalid role." }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: target } = await supabaseAdmin
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", adminId)
    .single();

  if (!target) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  // Don't let a Super Admin accidentally demote themselves out of their
  // own only access — self-role-changes are blocked entirely here.
  if (adminId === auth.callerId) {
    return NextResponse.json({ error: "You cannot change your own role." }, { status: 400 });
  }

  // If demoting the last remaining Super Admin, refuse — this would
  // lock the whole system out of Super Admin access permanently.
  if (target.role === "super_admin" && newRole !== "super_admin") {
    const { count } = await supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin")
      .eq("status", "active");

    if ((count ?? 0) <= 1) {
      return NextResponse.json({ error: "At least one active Super Admin must remain." }, { status: 400 });
    }
  }

  const { error } = await supabaseAdmin.from("profiles").update({ role: newRole }).eq("id", adminId);
  if (error) {
    console.error("Change role error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminActivity({
    actorAdminId: auth.callerId,
    targetAdminId: adminId,
    action: "Role changed",
    details: `${target.full_name ?? "Admin"}: ${target.role} → ${newRole}`,
  });

  return NextResponse.json({ success: true });
}