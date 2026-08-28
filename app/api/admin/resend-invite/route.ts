import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifySuperAdminCaller, logAdminActivity } from "@/lib/admin-auth-guard";

const INVITE_EXPIRY_HOURS = 24;

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
    .select("id, full_name, email, status, role")
    .eq("id", adminId)
    .single();

  if (!profile || profile.status !== "pending_invitation") {
    return NextResponse.json({ error: "This account has no pending invitation to resend." }, { status: 400 });
  }

  // Cancel any prior unused invitation for this admin, then create a fresh one
  await supabaseAdmin
    .from("admin_invitations")
    .update({ cancelled_at: new Date().toISOString() })
    .eq("admin_id", adminId)
    .is("used_at", null)
    .is("cancelled_at", null);

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

  const { error: inviteError } = await supabaseAdmin.from("admin_invitations").insert({
    admin_id: adminId,
    token_hash: tokenHash,
    role_offered: profile.role,
    invited_by: auth.callerId,
    expires_at: expiresAt.toISOString(),
  });

  if (inviteError) {
    console.error("Resend invite: insert error:", inviteError);
    return NextResponse.json({ error: "Failed to create a new invitation." }, { status: 500 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && profile.email) {
    try {
      const resend = new Resend(resendApiKey);
      const acceptUrl = `${request.nextUrl.origin}/admin/accept-invite?token=${rawToken}&id=${adminId}`;
      const roleLabel = profile.role === "super_admin" ? "Super Admin" : "Admin";

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "5CEE Farms <onboarding@resend.dev>",
        to: profile.email,
        subject: "Reminder: your 5CEE Farms admin invitation",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #2B2B2B;">
            <div style="background-color: #1B5E20; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0;">5CEE FARMS LTD</p>
              <p style="color: #D4A017; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 4px 0 0;">Chiso Foods — Admin Panel</p>
            </div>
            <div style="border: 1px solid #1B5E2020; border-top: none; padding: 28px 24px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 15px;">Hello ${profile.full_name ?? ""},</p>
              <p style="font-size: 14px; line-height: 1.6;">Here's a fresh link to set up your <strong>${roleLabel}</strong> account at 5CEE Farms Ltd — your previous link has expired or been replaced.</p>
              <p style="text-align: center; margin: 28px 0;">
                <a href="${acceptUrl}" style="background-color: #D4A017; color: #2B2B2B; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: bold; font-size: 14px;">Set Up My Account</a>
              </p>
              <p style="font-size: 12px; color: #2B2B2B99;">This link will expire in ${INVITE_EXPIRY_HOURS} hours.</p>
            </div>
          </div>
        `,
      });
    } catch (err) {
      console.error("Resend invite: email error:", err);
    }
  }

  await logAdminActivity({
    actorAdminId: auth.callerId,
    targetAdminId: adminId,
    action: "Invitation resent",
  });

  return NextResponse.json({ success: true });
}