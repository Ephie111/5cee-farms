import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifySuperAdminCaller, logAdminActivity } from "@/lib/admin-auth-guard";

export async function POST(request: NextRequest) {
  const auth = await verifySuperAdminCaller(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { adminId } = await request.json();
  if (!adminId) {
    return NextResponse.json({ error: "Missing adminId." }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, status, full_name")
    .eq("id", adminId)
    .single();

  if (!profile || profile.status !== "pending_invitation") {
    return NextResponse.json({ error: "This account has no pending invitation to cancel." }, { status: 400 });
  }

  // Mark any outstanding invitation rows as cancelled (kept for the
  // record — invitations are never deleted, only marked).
  await supabaseAdmin
    .from("admin_invitations")
    .update({ cancelled_at: new Date().toISOString() })
    .eq("admin_id", adminId)
    .is("used_at", null)
    .is("cancelled_at", null);

  // The invited person never activated this account, so there's no
  // real activity history to preserve — clean up the unused auth
  // account entirely (this cascades to delete the profiles row too).
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(adminId);
  if (deleteError) {
    console.error("Cancel invite: delete user error:", deleteError);
    return NextResponse.json({ error: "Failed to cancel the invitation." }, { status: 500 });
  }

  await logAdminActivity({
    actorAdminId: auth.callerId,
    targetAdminId: null, // the target account no longer exists
    action: "Invitation cancelled",
    details: profile.full_name ? `Cancelled invitation for ${profile.full_name}` : undefined,
  });

  return NextResponse.json({ success: true });
}