"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getActivityLog, ActivityEntry } from "@/lib/admin-activity";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ActivityLogPage() {
  const [entries, setEntries] = useState<ActivityEntry[] | null>(null);

  useEffect(() => {
    getActivityLog(100).then(setEntries);
  }, []);

  return (
    <div>
      <Link href="/admin/team" className="text-xs font-semibold text-forest hover:underline">
        ← Back to Manage Admins
      </Link>

      <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Admin Activity Log</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        A record of admin-management actions — invitations, role changes, logins, and status changes.
      </p>

      {entries === null ? (
        <p className="mt-16 text-center text-sm text-charcoal/50">Loading activity…</p>
      ) : entries.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
          <p>No activity recorded yet.</p>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-forest/10 bg-white">
          <ul className="divide-y divide-forest/5">
            {entries.map((entry) => (
              <li key={entry.id} className="p-5">
                <p className="text-sm text-charcoal">
                  <span className="font-semibold">{entry.actorName ?? "System"}</span>{" "}
                  {entry.action.toLowerCase()}
                  {entry.targetName && entry.targetName !== entry.actorName ? (
                    <>
                      {" "}
                      — <span className="font-medium">{entry.targetName}</span>
                    </>
                  ) : null}
                  {entry.details ? (
                    <span className="text-charcoal/60"> ({entry.details})</span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-charcoal/40">{formatDateTime(entry.createdAt)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}