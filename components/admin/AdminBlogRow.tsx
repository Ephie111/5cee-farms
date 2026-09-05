"use client";

import { useState } from "react";
import Link from "next/link";
import { BlogPost, formatBlogDate } from "@/lib/blog";

export default function AdminBlogRow({
  post,
  onTogglePublish,
  onDelete,
}: {
  post: BlogPost;
  onTogglePublish: (slug: string, publish: boolean) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handleTogglePublish() {
    setBusy(true);
    try {
      await onTogglePublish(post.slug, !post.isPublished);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await onDelete(post.slug);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-sm font-bold text-charcoal">{post.title}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              post.isPublished ? "bg-forest/10 text-forest" : "bg-gold/15 text-gold-dark"
            }`}
          >
            {post.isPublished ? "Published" : "Draft"}
          </span>
        </div>
        <p className="mt-1 text-xs text-charcoal/50">
          {post.category} · {formatBlogDate(post.publishedAt)} · {post.readTimeMinutes} min read
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/admin/blog/${post.slug}/edit`}
          className="rounded-full border border-forest/20 px-3.5 py-1.5 text-xs font-semibold text-forest hover:bg-forest/5"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={handleTogglePublish}
          disabled={busy}
          className="rounded-full border border-forest/20 px-3.5 py-1.5 text-xs font-semibold text-charcoal/60 hover:bg-forest/5 disabled:opacity-50"
        >
          {post.isPublished ? "Unpublish" : "Publish"}
        </button>
        {confirmingDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {busy ? "Deleting…" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={busy}
              className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-charcoal/60 hover:bg-forest/5"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}