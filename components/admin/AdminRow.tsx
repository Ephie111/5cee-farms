"use client";

import Link from "next/link";
import { AdminProfile } from "@/lib/admin-users";
import { AdminStatusBadge, RoleBadge } from "./AdminBadges";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminRow({
  admin,
  isSelf,
  onResend,
  onCancelInvite,
  onChangeRole,
  onDeactivate,
  onSuspend,
  onReactivate,
  onResign,
}: {
  admin: AdminProfile;
  isSelf: boolean;
  onResend: () => void;
  onCancelInvite: () => void;
  onChangeRole: () => void;
  onDeactivate: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onResign: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-sm font-bold text-charcoal">
            {admin.fullName ?? "Unnamed"} {isSelf && <span className="text-xs font-normal text-charcoal/40">(you)</span>}
          </p>
          <RoleBadge role={admin.role} />
          <AdminStatusBadge status={admin.status} />
        </div>
        <p className="mt-1 text-xs text-charcoal/50">{admin.email}</p>
        <p className="mt-1 text-xs text-charcoal/40">
          Added {formatDate(admin.createdAt)}
          {admin.invitedByName ? ` · Invited by ${admin.invitedByName}` : ""}
          {admin.lastLogin ? ` · Last login ${formatDate(admin.lastLogin)}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/team/${admin.id}`}
          className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-charcoal/60 hover:bg-forest/5"
        >
          View Details
        </Link>

        {admin.status === "pending_invitation" && (
          <>
            <button type="button" onClick={onResend} className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest/5">
              Resend Invitation
            </button>
            <button type="button" onClick={onCancelInvite} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
              Cancel Invitation
            </button>
          </>
        )}

        {admin.status === "active" && !isSelf && (
          <>
            <button type="button" onClick={onChangeRole} className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest/5">
              Change Role
            </button>
            <button type="button" onClick={onDeactivate} className="rounded-full border border-charcoal/20 px-3 py-1.5 text-xs font-semibold text-charcoal/60 hover:bg-charcoal/5">
              Deactivate
            </button>
            <button type="button" onClick={onSuspend} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
              Suspend
            </button>
            <button type="button" onClick={onResign} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
              Mark as Resigned
            </button>
          </>
        )}

        {["inactive", "suspended", "resigned"].includes(admin.status) && (
          <button type="button" onClick={onReactivate} className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest/5">
            Reactivate
          </button>
        )}
      </div>
    </div>
  );
}