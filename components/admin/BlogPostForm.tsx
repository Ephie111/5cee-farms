"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BlogPost, BlogPostInput, BlogCategory, slugifyBlogTitle, uploadBlogImage } from "@/lib/blog";

const CATEGORIES: BlogCategory[] = ["Recipes", "Farm Updates", "Nutrition", "Behind the Scenes"];

export type BlogFormValues = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // one paragraph per line in the form, split into an array on submit
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readTimeMinutes: string;
  image: string | null;
  imagePosition: string;
  isPublished: boolean;
  videoUrl: string;
};

function toFormValues(post: BlogPost): BlogFormValues {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content.join("\n\n"),
    category: post.category,
    author: post.author,
    publishedAt: post.publishedAt,
    readTimeMinutes: String(post.readTimeMinutes),
    image: post.image,
    imagePosition: post.imagePosition ?? "",
    isPublished: post.isPublished,
    videoUrl: post.videoUrl ?? "",
  };
}

const EMPTY_VALUES: BlogFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category: "Recipes",
  author: "5CEE Farms Team",
  publishedAt: new Date().toISOString().split("T")[0],
  readTimeMinutes: "4",
  image: null,
  imagePosition: "",
  videoUrl: "",
  isPublished: true,
};

export default function BlogPostForm({
  existingPost,
  onSubmit,
}: {
  /** Pass an existing BlogPost when editing; omit for a new post. */
  existingPost?: BlogPost;
  onSubmit: (slug: string, input: Omit<BlogPostInput, "slug">) => Promise<void>;
}) {
  const router = useRouter();
  const isEditing = !!existingPost;

  const [values, setValues] = useState<BlogFormValues>(
    existingPost ? toFormValues(existingPost) : EMPTY_VALUES
  );
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BlogFormValues>(key: K, val: BlogFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    // Auto-fill the slug from the title until the admin edits the slug
    // themselves — after that, respect whatever they typed.
    if (!slugManuallyEdited) {
      set("slug", slugifyBlogTitle(title));
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    if (!values.slug.trim()) {
      setError("Enter a title first, so the image has a slug to upload under.");
      return;
    }

    setError(null);
    setUploadingImage(true);
    try {
      const url = await uploadBlogImage(values.slug.trim(), file);
      set("image", url);
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.title.trim() || !values.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    if (!values.excerpt.trim()) {
      setError("Add a short excerpt.");
      return;
    }
    const content = values.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (content.length === 0) {
      setError("Add at least one paragraph of content.");
      return;
    }
    const readTimeMinutes = Number(values.readTimeMinutes);
    if (Number.isNaN(readTimeMinutes) || readTimeMinutes <= 0) {
      setError("Enter a valid read time.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(values.slug.trim(), {
        title: values.title.trim(),
        excerpt: values.excerpt.trim(),
        content,
        category: values.category,
        author: values.author.trim() || "5CEE Farms Team",
        publishedAt: values.publishedAt,
        readTimeMinutes,
        image: values.image,
        imagePosition: values.imagePosition.trim() || null,
        videoUrl: values.videoUrl.trim() || null,
        isPublished: values.isPublished,
      });
      router.push("/admin/blog");
    } catch (err) {
      console.error("Blog post save error:", err);
      setError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-forest/10 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Title</span>
          <input
            type="text"
            value={values.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Photo</span>
          <div className="flex items-center gap-4">
            <div className="img-placeholder relative h-24 w-40 shrink-0 overflow-hidden rounded-xl">
              {values.image ? (
                <Image
                  src={values.image}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover"
                  style={{ objectPosition: values.imagePosition || "center" }}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
                </svg>
              )}
            </div>
            <div>
              <label className="inline-flex cursor-pointer items-center rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest hover:bg-forest/5">
                {uploadingImage ? "Uploading…" : values.image ? "Replace Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {values.image && (
                <button
                  type="button"
                  onClick={() => set("image", null)}
                  className="ml-2 text-xs font-medium text-charcoal/50 hover:text-red-600"
                >
                  Remove
                </button>
              )}
              <p className="mt-1 text-[11px] text-charcoal/40">JPG or PNG, up to 5MB.</p>
            </div>
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">
            Image Position <span className="font-normal text-charcoal/40">(optional, e.g. "top" or "50% 20%")</span>
          </span>
          <input
            type="text"
            placeholder="center"
            value={values.imagePosition}
            onChange={(e) => set("imagePosition", e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">
            YouTube Video Link <span className="font-normal text-charcoal/40">(optional — shows instead of the photo when set)</span>
          </span>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={values.videoUrl}
            onChange={(e) => set("videoUrl", e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">
            Slug <span className="font-normal text-charcoal/40">(used in the post URL — auto-filled from the title)</span>
          </span>
          <input
            type="text"
            value={values.slug}
            disabled={isEditing}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              set("slug", slugifyBlogTitle(e.target.value));
            }}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 font-mono text-xs focus:border-forest focus:outline-none disabled:bg-forest/5 disabled:text-charcoal/50"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Category</span>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value as BlogCategory)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Author</span>
          <input
            type="text"
            value={values.author}
            onChange={(e) => set("author", e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Read Time (minutes)</span>
          <input
            type="number"
            min="1"
            value={values.readTimeMinutes}
            onChange={(e) => set("readTimeMinutes", e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Published Date</span>
          <input
            type="date"
            value={values.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Excerpt</span>
          <textarea
            value={values.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">
            Content <span className="font-normal text-charcoal/40">(separate paragraphs with a blank line)</span>
          </span>
          <textarea
            value={values.content}
            onChange={(e) => set("content", e.target.value)}
            rows={10}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 text-sm leading-relaxed focus:border-forest focus:outline-none"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(e) => set("isPublished", e.target.checked)}
          className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest"
        />
        Published (visible on the public Blog)
      </label>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="rounded-full border border-forest/20 px-6 py-3 text-sm font-semibold text-charcoal/60 hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}