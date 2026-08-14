import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const callerToken = authHeader?.replace("Bearer ", "");

  if (!callerToken) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(callerToken);
  if (callerError || !callerData.user) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", callerData.user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Only admins can remove admin access." }, { status: 403 });
  }

  const { targetUserId } = await request.json();
  if (!targetUserId) {
    return NextResponse.json({ error: "Missing targetUserId." }, { status: 400 });
  }

  // Safety rail 1: don't let an admin remove their own access — that's
  // what "Change Your Password" / just logging out is for, and doing it
  // here invites accidental self-lockout.
  if (targetUserId === callerData.user.id) {
    return NextResponse.json({ error: "You can't remove your own admin access." }, { status: 400 });
  }

  // Safety rail 2: never allow removing the last admin — that would
  // lock everyone out of the admin panel with no way back in short of
  // editing the database directly again.
  const { count } = await supabaseAdmin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");

  if ((count ?? 0) <= 1) {
    return NextResponse.json({ error: "Can't remove the last remaining admin." }, { status: 400 });
  }

  // The actual revocation: demote back to "customer". Their login still
  // works — they just have zero special access from this point on.
  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ role: "customer" })
    .eq("id", targetUserId);

  if (updateError) {
    console.error("Remove admin error:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}