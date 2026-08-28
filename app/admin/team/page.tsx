"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getAllAdmins,
  resendInvitation,
  cancelInvitation,
  setAdminStatus,
  AdminProfile,
  AdminRole,
  AdminStatus,
  StatusAction,
} from "@/lib/admin-users";
import InviteAdminModal from "@/components/admin/InviteAdminModal";
import ChangeRoleModal from "@/components/admin/ChangeRoleModal";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import AdminRow from "@/components/admin/AdminRow";

const ROLE_FILTERS: (AdminRole | "All")[] = ["All", "admin", "super_admin"];
const STATUS_FILTERS: (AdminStatus | "All")[] = ["All", "active", "pending_invitation", "inactive", "suspended", "resigned"];

const ROLE_LABELS: Record<AdminRole | "All", string> = {
  All: "All Roles",
  admin: "Admin",
  super_admin: "Super Admin",
};
const STATUS_LABELS: Record<AdminStatus | "All", string> = {
  All: "All Statuses",
  active: "Active",
  pending_invitation: "Pending",
  inactive: "Inactive",
  suspended: "Suspended",
  resigned: "Resigned",
};

type ConfirmState =
  | { admin: AdminProfile; kind: "cancel-invite" }
  | { admin: AdminProfile; kind: StatusAction };

export default function ManageAdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminProfile[] | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<AdminStatus | "All">("All");

  const [showInvite, setShowInvite] = useState(false);
  const [roleModalAdmin, setRoleModalAdmin] = useState<AdminProfile | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function refresh() {
    const list = await getAllAdmins();
    setAdmins(list);
  }

  useEffect(() => {
    refresh();
  }, []);

  function flash(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  const filtered = useMemo(() => {
    if (!admins) return [];
    const q = search.trim().toLowerCase();
    return admins.filter((a) => {
      const matchesSearch =
        !q || (a.fullName ?? "").toLowerCase().includes(q) || (a.email ?? "").toLowerCase().includes(q);
      const matchesRole = roleFilter === "All" || a.role === roleFilter;
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [admins, search, roleFilter, statusFilter]);

  async function handleResend(admin: AdminProfile) {
    try {
      await resendInvitation(admin.id);
      flash("success", `Invitation resent to ${admin.fullName ?? admin.email}.`);
      refresh();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Failed to resend invitation.");
    }
  }

  async function handleConfirmedAction(note?: string) {
    if (!confirmState) return;
    const { admin, kind } = confirmState;
    if (kind === "cancel-invite") {
      await cancelInvitation(admin.id);
      flash("success", `Invitation for ${admin.fullName ?? admin.email} was cancelled.`);
    } else {
      await setAdminStatus(admin.id, kind, note);
      const verb =
        kind === "deactivate" ? "deactivated" : kind === "suspend" ? "suspended" : kind === "resign" ? "marked as resigned" : "reactivated";
      flash("success", `${admin.fullName ?? admin.email} was ${verb}.`);
    }
    setConfirmState(null);
    refresh();
  }

  const confirmCopy: Record<ConfirmState["kind"], { title: string; description: string; label: string; tone: "danger" | "primary"; showNote: boolean }> = {
    "cancel-invite": {
      title: "Cancel Invitation",
      description: "This will cancel the pending invitation and remove the unused account. This cannot be undone.",
      label: "Cancel Invitation",
      tone: "danger",
      showNote: false,
    },
    deactivate: {
      title: "Deactivate Account",
      description: "This admin will no longer be able to log in. Their account can be reactivated later.",
      label: "Deactivate",
      tone: "danger",
      showNote: true,
    },
    suspend: {
      title: "Suspend Account",
      description: "This admin will be immediately blocked from logging in, pending review.",
      label: "Suspend",
      tone: "danger",
      showNote: true,
    },
    resign: {
      title: "Confirm Resignation",
      description:
        "This will immediately revoke their access to the admin system. Their account and activity history will be kept for record purposes.",
      label: "Confirm Resignation",
      tone: "danger",
      showNote: true,
    },
    reactivate: {
      title: "Reactivate Account",
      description: "This admin will regain access. If they had resigned, they'll be sent a new secure link to set a fresh password.",
      label: "Reactivate",
      tone: "primary",
      showNote: false,
    },
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Manage Admins</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Invite and manage administrator accounts. Admin accounts cannot be created through public signup.
          </p>
        </div>
        <button type="button" onClick={() => setShowInvite(true)} className="btn-primary">
          + Invite New Admin
        </button>
      </div>

      {message && (
        <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${message.type === "success" ? "bg-forest/5 text-forest" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as AdminRole | "All")}
            className="rounded-full border border-forest/20 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal/70 focus:border-forest focus:outline-none"
          >
            {ROLE_FILTERS.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdminStatus | "All")}
            className="rounded-full border border-forest/20 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal/70 focus:border-forest focus:outline-none"
          >
            {STATUS_FILTERS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-forest/20 px-3 py-2 text-sm focus:border-forest focus:outline-none sm:w-64"
        />
      </div>

      {admins === null ? (
        <p className="mt-16 text-center text-sm text-charcoal/50">Loading admins…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
          <p>No admins match this view.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((admin) => (
            <AdminRow
              key={admin.id}
              admin={admin}
              isSelf={admin.id === user?.id}
              onResend={() => handleResend(admin)}
              onCancelInvite={() => setConfirmState({ admin, kind: "cancel-invite" })}
              onChangeRole={() => setRoleModalAdmin(admin)}
              onDeactivate={() => setConfirmState({ admin, kind: "deactivate" })}
              onSuspend={() => setConfirmState({ admin, kind: "suspend" })}
              onReactivate={() => setConfirmState({ admin, kind: "reactivate" })}
              onResign={() => setConfirmState({ admin, kind: "resign" })}
            />
          ))}
        </div>
      )}

      {showInvite && (
        <InviteAdminModal
          canInviteSuperAdmin
          onClose={() => setShowInvite(false)}
          onInvited={() => {
            setShowInvite(false);
            flash("success", "Invitation sent.");
            refresh();
          }}
        />
      )}

      {roleModalAdmin && (
        <ChangeRoleModal
          adminId={roleModalAdmin.id}
          adminName={roleModalAdmin.fullName ?? roleModalAdmin.email ?? "this admin"}
          currentRole={roleModalAdmin.role}
          canAssignSuperAdmin
          onClose={() => setRoleModalAdmin(null)}
          onChanged={() => {
            setRoleModalAdmin(null);
            flash("success", "Role updated.");
            refresh();
          }}
        />
      )}

      {confirmState && (
        <ConfirmActionModal
          title={confirmCopy[confirmState.kind].title}
          description={`${confirmCopy[confirmState.kind].description}${
            confirmState.kind !== "cancel-invite" ? ` — ${confirmState.admin.fullName ?? confirmState.admin.email}` : ""
          }`}
          confirmLabel={confirmCopy[confirmState.kind].label}
          confirmTone={confirmCopy[confirmState.kind].tone}
          showNoteField={confirmCopy[confirmState.kind].showNote}
          onConfirm={handleConfirmedAction}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </div>
  );
}