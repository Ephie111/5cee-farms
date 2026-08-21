"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { getAllBlogPosts, BlogPost } from "@/lib/blog";

const CATEGORIES: (BlogPost["category"] | "All")[] = [
  "All",
  "Recipes",
  "Farm Updates",
  "Nutrition",
  "Behind the Scenes",
];

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(
    () => (filter === "All" ? posts : posts.filter((p) => p.category === filter)),
    [posts, filter]
  );

  return (
    <>
      <Header />
      <main>
        <section className="bg-forest py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">From the Farm</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Blog</h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Recipes, farm updates, and nutrition tips from the 5CEE Farms team.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  filter === cat ? "bg-forest text-white" : "bg-forest/5 text-charcoal/60 hover:bg-forest/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
              <p>No posts in this category yet.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}