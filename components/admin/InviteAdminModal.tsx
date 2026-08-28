"use client";

import { useState } from "react";
import { inviteAdmin, AdminRole } from "@/lib/admin-users";

export default function InviteAdminModal({
  canInviteSuperAdmin,
  onClose,
  onInvited,
}: {
  canInviteSuperAdmin: boolean;
  onClose: () => void;
  onInvited: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError("Full name and email are required.");
      return;
    }

    setLoading(true);
    try {
      await inviteAdmin({ fullName: fullName.trim(), email: email.trim(), role });
      onInvited();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/40 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-lg font-bold text-forest">Invite New Admin</h2>
        <p className="mt-1 text-sm text-charcoal/60">
          Send an invitation to allow this person to securely set up their own administrator account.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            >
              <option value="admin">Admin</option>
              {canInviteSuperAdmin && <option value="super_admin">Super Admin</option>}
            </select>
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-full border border-forest/20 px-4 py-2.5 text-sm font-semibold text-charcoal/60 hover:bg-forest/5"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
              {loading ? "Sending…" : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}