import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifySuperAdminCaller, logAdminActivity } from "@/lib/admin-auth-guard";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ["admin", "super_admin"];
const INVITE_EXPIRY_HOURS = 24;

export async function POST(request: NextRequest) {
  const auth = await verifySuperAdminCaller(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { fullName, email, role } = await request.json();

  if (!fullName?.trim() || !email?.trim() || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Full name, a valid email, and a valid role are required." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Prevent duplicate accounts for the same email — check our own
  // profiles table first, which covers customers and existing admins alike.
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (existing.status === "pending_invitation") {
      return NextResponse.json(
        { error: "An invitation is already pending for this email. Resend or cancel it instead of sending a new one." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  // Create the auth account with NO password — they can't log in until
  // they complete the invitation flow and set one themselves. The
  // handle_new_user() trigger auto-creates a matching profiles row
  // (as role='customer', status='active') which we immediately correct below.
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !newUser.user) {
    console.error("Invite: create user error:", createError);
    return NextResponse.json({ error: createError?.message ?? "Failed to create account." }, { status: 400 });
  }

  const adminId = newUser.user.id;

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      role,
      status: "pending_invitation",
      invited_by: auth.callerId,
      invited_at: new Date().toISOString(),
      full_name: fullName,
    })
    .eq("id", adminId);

  if (profileError) {
    console.error("Invite: profile update error:", profileError);
    return NextResponse.json({ error: "Account created but could not be set up as pending. Contact support." }, { status: 500 });
  }

  // Generate the secure token: the RAW token only ever exists in the
  // email link; only its hash is stored, so a database leak alone can't
  // be used to accept someone else's invitation.
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

  const { error: inviteError } = await supabaseAdmin.from("admin_invitations").insert({
    admin_id: adminId,
    token_hash: tokenHash,
    role_offered: role,
    invited_by: auth.callerId,
    expires_at: expiresAt.toISOString(),
  });

  if (inviteError) {
    console.error("Invite: invitation row error:", inviteError);
    return NextResponse.json({ error: "Failed to create invitation record." }, { status: 500 });
  }

  // Send the branded invitation email
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const acceptUrl = `${request.nextUrl.origin}/admin/accept-invite?token=${rawToken}&id=${adminId}`;
      const roleLabel = role === "super_admin" ? "Super Admin" : "Admin";

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "5CEE Farms <onboarding@resend.dev>",
        to: email,
        subject: "You've been invited to join 5CEE Farms Ltd",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #2B2B2B;">
            <div style="background-color: #1B5E20; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0;">5CEE FARMS LTD</p>
              <p style="color: #D4A017; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 4px 0 0;">Chiso Foods — Admin Panel</p>
            </div>
            <div style="border: 1px solid #1B5E2020; border-top: none; padding: 28px 24px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 15px;">Hello ${fullName},</p>
              <p style="font-size: 14px; line-height: 1.6;">You have been invited to join 5CEE Farms Ltd as a <strong>${roleLabel}</strong>.</p>
              <p style="font-size: 14px; line-height: 1.6;">Click the secure link below to set up your administrator account.</p>
              <p style="text-align: center; margin: 28px 0;">
                <a href="${acceptUrl}" style="background-color: #D4A017; color: #2B2B2B; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: bold; font-size: 14px;">Set Up My Account</a>
              </p>
              <p style="font-size: 12px; color: #2B2B2B99;">For security reasons, this invitation link will expire in ${INVITE_EXPIRY_HOURS} hours.</p>
              <p style="font-size: 12px; color: #2B2B2B99;">If you were not expecting this invitation, please ignore this email.</p>
            </div>
          </div>
        `,
      });
    } catch (err) {
      console.error("Invite: email send error:", err);
      // Don't fail the whole invite just because the email failed to
      // send — the invitation record already exists and can be resent.
    }
  }

  await logAdminActivity({
    actorAdminId: auth.callerId,
    targetAdminId: adminId,
    action: "Invitation sent",
    details: `Invited as ${role}`,
  });

  return NextResponse.json({ success: true, adminId });
}