"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  getAdminById,
  resendInvitation,
  cancelInvitation,
  setAdminStatus,
  AdminProfile,
  StatusAction,
} from "@/lib/admin-users";
import { getActivityForAdmin, ActivityEntry } from "@/lib/admin-activity";
import { AdminStatusBadge, RoleBadge } from "@/components/admin/AdminBadges";
import ChangeRoleModal from "@/components/admin/ChangeRoleModal";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-NG", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

type ConfirmKind = "cancel-invite" | StatusAction;

export default function AdminDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [admin, setAdmin] = useState<AdminProfile | null | undefined>(undefined);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [confirmKind, setConfirmKind] = useState<ConfirmKind | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function refresh() {
    const found = await getAdminById(params.id);
    setAdmin(found ?? null);
    if (found) setActivity(await getActivityForAdmin(found.id));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  function flash(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleResend() {
    if (!admin) return;
    try {
      await resendInvitation(admin.id);
      flash("success", "Invitation resent.");
      refresh();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Failed to resend.");
    }
  }

  async function handleConfirmed(note?: string) {
    if (!admin || !confirmKind) return;
    if (confirmKind === "cancel-invite") {
      await cancelInvitation(admin.id);
      flash("success", "Invitation cancelled.");
      router.push("/admin/team");
      return;
    }
    await setAdminStatus(admin.id, confirmKind, note);
    flash("success", "Status updated.");
    setConfirmKind(null);
    refresh();
  }

  const confirmCopy: Record<ConfirmKind, { title: string; description: string; label: string; tone: "danger" | "primary"; showNote: boolean }> = {
    "cancel-invite": {
      title: "Cancel Invitation",
      description: "This will cancel the pending invitation and remove the unused account.",
      label: "Cancel Invitation",
      tone: "danger",
      showNote: false,
    },
    deactivate: { title: "Deactivate Account", description: "This admin will no longer be able to log in.", label: "Deactivate", tone: "danger", showNote: true },
    suspend: { title: "Suspend Account", description: "This admin will be immediately blocked from logging in.", label: "Suspend", tone: "danger", showNote: true },
    resign: {
      title: "Confirm Resignation",
      description: "This will immediately revoke their access to the admin system. Their account and activity history will be kept for record purposes.",
      label: "Confirm Resignation",
      tone: "danger",
      showNote: true,
    },
    reactivate: { title: "Reactivate Account", description: "This admin will regain access.", label: "Reactivate", tone: "primary", showNote: false },
  };

  if (admin === undefined) return <p className="text-sm text-charcoal/50">Loading…</p>;
  if (admin === null) return <p className="text-sm text-charcoal/50">Admin not found.</p>;

  const isSelf = admin.id === user?.id;

  return (
    <div>
      <Link href="/admin/team" className="text-xs font-semibold text-forest hover:underline">
        ← Back to Manage Admins
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold sm:text-3xl">{admin.fullName ?? "Unnamed"}</h1>
            <RoleBadge role={admin.role} />
            <AdminStatusBadge status={admin.status} />
          </div>
          <p className="mt-1 text-sm text-charcoal/60">{admin.email}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {admin.status === "pending_invitation" && (
            <>
              <button type="button" onClick={handleResend} className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest hover:bg-forest/5">
                Resend Invitation
              </button>
              <button type="button" onClick={() => setConfirmKind("cancel-invite")} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                Cancel Invitation
              </button>
            </>
          )}
          {admin.status === "active" && !isSelf && (
            <>
              <button type="button" onClick={() => setShowRoleModal(true)} className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest hover:bg-forest/5">
                Change Role
              </button>
              <button type="button" onClick={() => setConfirmKind("deactivate")} className="rounded-full border border-charcoal/20 px-4 py-2 text-sm font-semibold text-charcoal/60 hover:bg-charcoal/5">
                Deactivate
              </button>
              <button type="button" onClick={() => setConfirmKind("suspend")} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                Suspend
              </button>
              <button type="button" onClick={() => setConfirmKind("resign")} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                Mark as Resigned
              </button>
            </>
          )}
          {["inactive", "suspended", "resigned"].includes(admin.status) && (
            <button type="button" onClick={() => setConfirmKind("reactivate")} className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest hover:bg-forest/5">
              Reactivate
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${message.type === "success" ? "bg-forest/5 text-forest" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-forest/10 bg-white p-5">
          <h2 className="font-display text-sm font-bold text-forest">Account Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Date Created", formatDateTime(admin.createdAt)],
              ["Invited By", admin.invitedByName ?? "—"],
              ["Account Activated", formatDateTime(admin.activatedAt)],
              ["Last Login", formatDateTime(admin.lastLogin)],
              ...(admin.status === "inactive" ? [["Deactivated", formatDateTime(admin.deactivatedAt)]] : []),
              ...(admin.status === "suspended" ? [["Suspended", formatDateTime(admin.suspendedAt)]] : []),
              ...(admin.status === "resigned" ? [["Resigned", formatDateTime(admin.resignedAt)]] : []),
              ...(admin.statusNote ? [["Notes", admin.statusNote]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-forest/5 pb-2">
                <dt className="text-charcoal/50">{label}</dt>
                <dd className="text-right font-medium text-charcoal">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-forest/10 bg-white p-5">
          <h2 className="font-display text-sm font-bold text-forest">Recent Activity</h2>
          {activity.length === 0 ? (
            <p className="mt-4 text-sm text-charcoal/50">No activity recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {activity.map((entry) => (
                <li key={entry.id} className="border-b border-forest/5 pb-3 text-sm last:border-0">
                  <p className="text-charcoal">
                    <span className="font-medium">{entry.actorName ?? "System"}</span> — {entry.action}
                    {entry.details ? <span className="text-charcoal/60"> ({entry.details})</span> : null}
                  </p>
                  <p className="mt-0.5 text-xs text-charcoal/40">{formatDateTime(entry.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showRoleModal && (
        <ChangeRoleModal
          adminId={admin.id}
          adminName={admin.fullName ?? admin.email ?? "this admin"}
          currentRole={admin.role}
          canAssignSuperAdmin
          onClose={() => setShowRoleModal(false)}
          onChanged={() => {
            setShowRoleModal(false);
            flash("success", "Role updated.");
            refresh();
          }}
        />
      )}

      {confirmKind && (
        <ConfirmActionModal
          title={confirmCopy[confirmKind].title}
          description={confirmCopy[confirmKind].description}
          confirmLabel={confirmCopy[confirmKind].label}
          confirmTone={confirmCopy[confirmKind].tone}
          showNoteField={confirmCopy[confirmKind].showNote}
          onConfirm={handleConfirmed}
          onCancel={() => setConfirmKind(null)}
        />
      )}
    </div>
  );
}