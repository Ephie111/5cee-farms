"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getAdminList, createAdminAccount, AdminProfile } from "@/lib/admin-users";
import AdminListRow from "@/components/admin/AdminListRow";

export default function ManageAdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminProfile[] | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function refresh() {
    const list = await getAdminList();
    setAdmins(list);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setCreating(true);

    try {
      await createAdminAccount({ email, password, fullName });
      setSuccessMessage(
        `Admin account created for ${email}. Share the password with them directly — they can log in right away at /admin/login.`
      );
      setFullName("");
      setEmail("");
      setPassword("");
      refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create admin account.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Manage Admins</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Create admin accounts directly — no customer signup involved.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Create new admin */}
        <form onSubmit={handleCreate} className="space-y-4 rounded-2xl border border-forest/10 bg-white p-6">
          <h2 className="font-display text-sm font-bold text-forest">Create New Admin</h2>

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
            <span className="font-medium text-charcoal/80">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">
              Temporary Password <span className="font-normal text-charcoal/40">(share this with them directly)</span>
            </span>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {successMessage && <p className="rounded-lg bg-forest/5 px-3 py-2 text-sm text-forest">{successMessage}</p>}

          <button type="submit" disabled={creating} className="btn-primary w-full disabled:opacity-60">
            {creating ? "Creating…" : "Create Admin Account"}
          </button>
        </form>

        {/* Current admins */}
        <div className="rounded-2xl border border-forest/10 bg-white p-6">
          <h2 className="font-display text-sm font-bold text-forest">Current Admins</h2>
          {admins === null ? (
            <p className="mt-4 text-sm text-charcoal/50">Loading…</p>
          ) : (
            <ul className="mt-4 divide-y divide-forest/5">
              {admins.map((admin) => (
                <AdminListRow
                  key={admin.id}
                  admin={admin}
                  isSelf={admin.id === user?.id}
                  canRemove={admins.length > 1}
                  onRemoved={refresh}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}