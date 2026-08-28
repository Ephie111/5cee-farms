import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { logAdminActivity } from "@/lib/admin-auth-guard";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export async function POST(request: NextRequest) {
  const { adminId, token, password } = await request.json();

  if (!adminId || !token || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!PASSWORD_REGEX.test(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters, with an uppercase letter, a lowercase letter, and a number." },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Find the most recent invitation for this admin matching the token hash
  const { data: invitation } = await supabaseAdmin
    .from("admin_invitations")
    .select("*")
    .eq("admin_id", adminId)
    .eq("token_hash", tokenHash)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!invitation) {
    return NextResponse.json({ error: "This invitation link is invalid." }, { status: 400 });
  }
  if (invitation.used_at) {
    return NextResponse.json({ error: "This invitation has already been used." }, { status: 400 });
  }
  if (invitation.cancelled_at) {
    return NextResponse.json({ error: "This invitation has been cancelled." }, { status: 400 });
  }
  if (new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json({ error: "This invitation has expired. Ask a Super Admin to resend it." }, { status: 400 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("status")
    .eq("id", adminId)
    .single();

  if (!profile || profile.status !== "pending_invitation") {
    return NextResponse.json({ error: "This account is not awaiting setup." }, { status: 400 });
  }

  // Set the real password — the Super Admin who invited this person
  // never sees or sets this value themselves.
  const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(adminId, { password });
  if (passwordError) {
    console.error("Accept invite: set password error:", passwordError);
    return NextResponse.json({ error: passwordError.message }, { status: 400 });
  }

  const now = new Date().toISOString();

  await supabaseAdmin.from("admin_invitations").update({ used_at: now }).eq("id", invitation.id);

  await supabaseAdmin
    .from("profiles")
    .update({ status: "active", activated_at: now })
    .eq("id", adminId);

  await logAdminActivity({
    actorAdminId: adminId,
    targetAdminId: adminId,
    action: "Invitation accepted",
    details: "Password created, account activated",
  });

  return NextResponse.json({ success: true });
}