import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { logAdminActivity } from "@/lib/admin-auth-guard";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ ok: true }); // always succeed silently
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, role")
    .eq("email", email)
    .maybeSingle();

  if (profile && ["admin", "super_admin"].includes(profile.role)) {
    await logAdminActivity({
      actorAdminId: null,
      targetAdminId: profile.id,
      action: "Failed login attempt",
    });
  }

  // Always return a generic success, regardless of whether the email
  // matched anything — this endpoint must never reveal which emails
  // have admin accounts.
  return NextResponse.json({ ok: true });
}