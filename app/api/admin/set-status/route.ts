import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifySuperAdminCaller, logAdminActivity } from "@/lib/admin-auth-guard";

type StatusAction = "deactivate" | "reactivate" | "suspend" | "resign";

// A very long ban effectively blocks login and (crucially) blocks the
// next refresh-token exchange too — this is what "revoke access" and
// "invalidate sessions" actually rely on at the platform level. A
// currently-open browser tab keeps its short-lived access token valid
// until it naturally expires (default ~1 hour) or the app itself
// re-checks status — see the note in app/admin/layout.tsx, which
// re-verifies status on every admin page load to close that gap.
const BAN_DURATION = "87600h"; // ~10 years — effectively permanent until lifted
const LIFT_BAN = "none";

const NOT_ALLOWED_FROM: Record<StatusAction, string[]> = {
  deactivate: ["pending_invitation"],
  suspend: ["pending_invitation"],
  resign: ["pending_invitation"],
  reactivate: [],
};

export async function POST(request: NextRequest) {
  const auth = await verifySuperAdminCaller(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { adminId, action, note } = await request.json() as {
    adminId: string;
    action: StatusAction;
    note?: string;
  };

  if (!adminId || !["deactivate", "reactivate", "suspend", "resign"].includes(action)) {
    return NextResponse.json({ error: "Missing adminId or invalid action." }, { status: 400 });
  }

  if (adminId === auth.callerId) {
    return NextResponse.json({ error: "You cannot perform this action on your own account." }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: target } = await supabaseAdmin
    .from("profiles")
    .select("id, role, status, full_name, email")
    .eq("id", adminId)
    .single();

  if (!target) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  if (NOT_ALLOWED_FROM[action].includes(target.status)) {
    return NextResponse.json({ error: `Cannot ${action} an account that's still a pending invitation.` }, { status: 400 });
  }

  // Refuse to remove access from the last remaining active Super Admin
  if (target.role === "super_admin" && action !== "reactivate") {
    const { count } = await supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin")
      .eq("status", "active");

    if ((count ?? 0) <= 1) {
      return NextResponse.json({ error: "At least one active Super Admin must remain." }, { status: 400 });
    }
  }

  const now = new Date().toISOString();

  if (action === "reactivate") {
    if (target.status === "resigned") {
      // Reactivating a FORMER admin: never restore their old password.
      // Instead, send them through the invitation flow again, exactly
      // like a brand-new admin.
      await supabaseAdmin.auth.admin.updateUserById(adminId, { ban_duration: LIFT_BAN });

      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await supabaseAdmin.from("admin_invitations").insert({
        admin_id: adminId,
        token_hash: tokenHash,
        role_offered: target.role,
        invited_by: auth.callerId,
        expires_at: expiresAt.toISOString(),
      });

      await supabaseAdmin
        .from("profiles")
        .update({
          status: "pending_invitation",
          invited_by: auth.callerId,
          invited_at: now,
          resigned_at: null,
        })
        .eq("id", adminId);

      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey && target.email) {
        try {
          const resend = new Resend(resendApiKey);
          const acceptUrl = `${request.nextUrl.origin}/admin/accept-invite?token=${rawToken}&id=${adminId}`;
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "5CEE Farms <onboarding@resend.dev>",
            to: target.email,
            subject: "Welcome back — set up your 5CEE Farms admin account",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #2B2B2B;">
                <div style="background-color: #1B5E20; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                  <p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0;">5CEE FARMS LTD</p>
                </div>
                <div style="border: 1px solid #1B5E2020; border-top: none; padding: 28px 24px; border-radius: 0 0 12px 12px;">
                  <p style="font-size: 15px;">Hello ${target.full_name ?? ""},</p>
                  <p style="font-size: 14px; line-height: 1.6;">Your admin account at 5CEE Farms Ltd has been reactivated. For security, please set a new password to regain access — your previous password no longer works.</p>
                  <p style="text-align: center; margin: 28px 0;">
                    <a href="${acceptUrl}" style="background-color: #D4A017; color: #2B2B2B; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: bold; font-size: 14px;">Set Up My Account</a>
                  </p>
                  <p style="font-size: 12px; color: #2B2B2B99;">This link will expire in 24 hours.</p>
                </div>
              </div>
            `,
          });
        } catch (err) {
          console.error("Reactivate: email error:", err);
        }
      }

      await logAdminActivity({
        actorAdminId: auth.callerId,
        targetAdminId: adminId,
        action: "Account reactivated",
        details: "Former admin — sent new account setup link (password not restored)",
      });
    } else {
      // Simple un-suspend / un-deactivate — same password still works.
      await supabaseAdmin.auth.admin.updateUserById(adminId, { ban_duration: LIFT_BAN });
      await supabaseAdmin.from("profiles").update({ status: "active" }).eq("id", adminId);

      await logAdminActivity({
        actorAdminId: auth.callerId,
        targetAdminId: adminId,
        action: "Account reactivated",
        details: `Restored from ${target.status}`,
      });
    }

    return NextResponse.json({ success: true });
  }

  // deactivate / suspend / resign — all three revoke access the same way
  await supabaseAdmin.auth.admin.updateUserById(adminId, { ban_duration: BAN_DURATION });

  const statusMap: Record<Exclude<StatusAction, "reactivate">, { status: string; field: string; label: string }> = {
    deactivate: { status: "inactive", field: "deactivated_at", label: "Account deactivated" },
    suspend: { status: "suspended", field: "suspended_at", label: "Account suspended" },
    resign: { status: "resigned", field: "resigned_at", label: "Account marked as resigned" },
  };
  const { status, field, label } = statusMap[action as Exclude<StatusAction, "reactivate">];

  await supabaseAdmin
    .from("profiles")
    .update({ status, [field]: now, status_note: note ?? null })
    .eq("id", adminId);

  await logAdminActivity({
    actorAdminId: auth.callerId,
    targetAdminId: adminId,
    action: label,
    details: note || undefined,
  });

  return NextResponse.json({ success: true });
}