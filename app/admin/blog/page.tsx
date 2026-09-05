"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminBlogRow from "@/components/admin/AdminBlogRow";
import { getAllBlogPostsAdmin, updateBlogPost, deleteBlogPost, BlogPost } from "@/lib/blog";

const STATUS_FILTERS = ["All", "Published", "Draft"] as const;

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [search, setSearch] = useState("");

  async function refresh() {
    const data = await getAllBlogPostsAdmin();
    setPosts(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleTogglePublish(slug: string, publish: boolean) {
    const post = posts?.find((p) => p.slug === slug);
    if (!post) return;
    await updateBlogPost(slug, {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt,
      readTimeMinutes: post.readTimeMinutes,
      image: post.image,
      imagePosition: post.imagePosition,
      videoUrl: post.videoUrl,
      isPublished: publish,
    });
    refresh();
  }

  async function handleDelete(slug: string) {
    await deleteBlogPost(slug);
    refresh();
  }

  const filtered = useMemo(() => {
    if (!posts) return [];
    return posts.filter((p) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Published" && p.isPublished) ||
        (filter === "Draft" && !p.isPublished);
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [posts, filter, search]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Blog Posts</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {posts === null ? "Loading…" : `${posts.length} post${posts.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary">
          + Add Post
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === f ? "bg-forest text-white" : "bg-white text-charcoal/60 hover:bg-forest/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-forest/20 px-3 py-2 text-sm focus:border-forest focus:outline-none sm:w-64"
        />
      </div>

      {posts === null ? (
        <p className="mt-16 text-center text-sm text-charcoal/50">Loading posts…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
          <p>No posts match this view.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((post) => (
            <AdminBlogRow key={post.slug} post={post} onTogglePublish={handleTogglePublish} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}