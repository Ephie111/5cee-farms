"use client";

import { useState } from "react";

export default function ConfirmActionModal({
  title,
  description,
  confirmLabel,
  confirmTone = "danger",
  showNoteField = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  confirmTone?: "danger" | "primary";
  showNoteField?: boolean;
  onConfirm: (note?: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    try {
      await onConfirm(note || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/40 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-base font-bold text-charcoal">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{description}</p>

        {showNoteField && (
          <label className="mt-4 flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">Reason / notes (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="rounded-lg border border-forest/20 px-3 py-2 text-sm focus:border-forest focus:outline-none"
            />
          </label>
        )}

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-full border border-forest/20 px-4 py-2.5 text-sm font-semibold text-charcoal/60 hover:bg-forest/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${
              confirmTone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-forest hover:bg-forest-light"
            }`}
          >
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}