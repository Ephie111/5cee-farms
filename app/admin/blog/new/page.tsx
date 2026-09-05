"use client";

import BlogPostForm from "@/components/admin/BlogPostForm";
import { createBlogPost, BlogPostInput } from "@/lib/blog";

export default function NewBlogPostPage() {
  async function handleSubmit(slug: string, input: Omit<BlogPostInput, "slug">) {
    await createBlogPost({ slug, ...input });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Add Blog Post</h1>
      <p className="mt-1 text-sm text-charcoal/60">Write a new post for the Blog.</p>
      <div className="mt-6">
        <BlogPostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}