"use client";

import { useState } from "react";
import { AdminProfile, removeAdminAccess } from "@/lib/admin-users";

export default function AdminListRow({
  admin,
  isSelf,
  canRemove,
  onRemoved,
}: {
  admin: AdminProfile;
  isSelf: boolean;
  /** false when this is the last remaining admin — removal is blocked either way, but this hides the button entirely for clarity. */
  canRemove: boolean;
  onRemoved: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmRemove() {
    setRemoving(true);
    setError(null);
    try {
      await removeAdminAccess(admin.id);
      onRemoved();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to remove access.");
      setRemoving(false);
      setConfirming(false);
    }
  }

  return (
    <li className="py-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-charcoal">
            {admin.fullName ?? "Unnamed"} {isSelf && <span className="text-xs text-charcoal/40">(you)</span>}
          </p>
          <p className="text-xs text-charcoal/50">{admin.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-charcoal/40">
            {new Date(admin.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
          </p>
          {!isSelf && canRemove && !confirming && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {confirming && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
          <p className="text-xs text-red-700">
            Remove admin access for {admin.fullName ?? admin.email}? Their login will still work, but they&apos;ll lose access to the admin panel immediately.
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={handleConfirmRemove}
              disabled={removing}
              className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {removing ? "Removing…" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={removing}
              className="rounded-full border border-forest/20 px-3 py-1 text-xs font-semibold text-charcoal/60 hover:bg-forest/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </li>
  );
}