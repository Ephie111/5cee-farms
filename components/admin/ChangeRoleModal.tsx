"use client";

import { useState } from "react";
import { changeAdminRole, AdminRole } from "@/lib/admin-users";

export default function ChangeRoleModal({
  adminId,
  adminName,
  currentRole,
  canAssignSuperAdmin,
  onClose,
  onChanged,
}: {
  adminId: string;
  adminName: string;
  currentRole: AdminRole;
  canAssignSuperAdmin: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [newRole, setNewRole] = useState<AdminRole>(currentRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newRole === currentRole) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await changeAdminRole(adminId, newRole);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change role.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/40 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-base font-bold text-charcoal">Change Role</h2>
        <p className="mt-1 text-sm text-charcoal/60">{adminName}</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">New Role</span>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as AdminRole)}
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            >
              <option value="admin">Admin</option>
              {canAssignSuperAdmin && <option value="super_admin">Super Admin</option>}
            </select>
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-full border border-forest/20 px-4 py-2.5 text-sm font-semibold text-charcoal/60 hover:bg-forest/5"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}