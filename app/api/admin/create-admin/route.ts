import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const callerToken = authHeader?.replace("Bearer ", "");

  if (!callerToken) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Step 1: figure out who's actually calling this, from their token.
  const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(callerToken);
  if (callerError || !callerData.user) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  // Step 2: confirm the caller is themselves an admin. This is the
  // gate that stops anyone but an existing admin from ever reaching
  // this endpoint successfully — it doesn't matter that this whole
  // route uses the all-powerful service role key, because we refuse
  // to do anything with it until this check passes.
  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", callerData.user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Only admins can create other admins." }, { status: 403 });
  }

  // Step 3: create the new admin account.
  const { email, password, fullName } = await request.json();

  if (!email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "A valid email and a password of at least 6 characters are required." },
      { status: 400 }
    );
  }

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // an admin is setting this up directly — skip the email verification step
    user_metadata: { full_name: fullName },
  });

  if (createError || !newUser.user) {
    console.error("Create admin error:", createError);
    return NextResponse.json({ error: createError?.message ?? "Failed to create account." }, { status: 400 });
  }

  // The signup trigger (handle_new_user) already created a "customer"
  // profile row for this new user automatically — promote it to admin.
  const { error: promoteError } = await supabaseAdmin
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", newUser.user.id);

  if (promoteError) {
    console.error("Promote to admin error:", promoteError);
    return NextResponse.json({ error: "Account created, but promoting to admin failed. Check Supabase directly." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}