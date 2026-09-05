"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { getBlogPostBySlugAdmin, updateBlogPost, BlogPost, BlogPostInput } from "@/lib/blog";

export default function EditBlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    getBlogPostBySlugAdmin(params.slug).then((found) => setPost(found ?? null));
  }, [params.slug]);

  async function handleSubmit(slug: string, input: Omit<BlogPostInput, "slug">) {
    await updateBlogPost(slug, input);
  }

  if (post === undefined) {
    return <p className="text-sm text-charcoal/50">Loading post…</p>;
  }

  if (post === null) {
    return <p className="text-sm text-charcoal/50">Post not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Edit Blog Post</h1>
      <p className="mt-1 text-sm text-charcoal/60">{post.title}</p>
      <div className="mt-6">
        <BlogPostForm existingPost={post} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}