import { supabase } from "./supabase";

export type BlogCategory = "Recipes" | "Farm Updates" | "Nutrition" | "Behind the Scenes";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // one array item per paragraph
  category: BlogCategory;
  publishedAt: string; // ISO date
  author: string;
  readTimeMinutes: number;
  /** Public URL (Supabase Storage) or a /public path — falls back to a placeholder box when not set. */
  image: string | null;
  /**
   * Fine-tunes which part of the photo shows inside the cropped frame.
   * Defaults to "center". Blog photos vary too much in framing for one
   * universal default (unlike team headshots), so override this
   * per-post when a specific photo looks cropped wrong — e.g. "top" to
   * keep more of the top of the photo in view, or a specific value
   * like "50% 20%" for fine control.
   */
  imagePosition: string | null;
  isPublished: boolean;
  /** Full YouTube URL — when set, the post's detail page embeds this video instead of showing the photo. */
  videoUrl: string | null;
};

type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: BlogCategory;
  published_at: string;
  author: string;
  read_time_minutes: number;
  image_url: string | null;
  image_position: string | null;
  is_published: boolean;
  video_url: string | null;
};

function mapRow(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    publishedAt: row.published_at,
    author: row.author,
    readTimeMinutes: row.read_time_minutes,
    image: row.image_url,
    imagePosition: row.image_position,
    isPublished: row.is_published,
    videoUrl: row.video_url,
  };
}

/** Every published post, most recent first. Public — no login needed. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getAllBlogPosts error:", error.message);
    return [];
  }
  return (data as BlogPostRow[]).map(mapRow);
}

/** A single published post by slug. Public. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return undefined;
  return mapRow(data as BlogPostRow);
}

/** Other published posts in the same category. Public. */
export async function getRelatedBlogPosts(post: BlogPost, count = 3): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("slug", post.slug)
    .limit(count);

  if (error) {
    console.error("getRelatedBlogPosts error:", error.message);
    return [];
  }
  return (data as BlogPostRow[]).map(mapRow);
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
}

/** Turns a post title into a URL-safe slug, e.g. "My New Post" → "my-new-post". */
export function slugifyBlogTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Pulls the video ID out of any common YouTube URL format
 * (watch?v=, youtu.be/, embed/, shorts/) so we can build a clean embed
 * URL. Returns null if the link doesn't look like a valid YouTube URL —
 * callers should fall back to the photo/placeholder in that case
 * rather than embedding something broken.
 */
export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// ---------------------------------------------------------------------
// Admin-only functions below. Reads/writes rely entirely on the
// database's own security rules (supabase/blog_management_migration.sql)
// — a non-admin calling these simply gets rejected or an empty result.
// ---------------------------------------------------------------------

/** Every post, published or draft, most recently updated first. Admins only. */
export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getAllBlogPostsAdmin error:", error.message);
    return [];
  }
  return (data as BlogPostRow[]).map(mapRow);
}

/** A single post by slug, published or draft. Admins only. */
export async function getBlogPostBySlugAdmin(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  if (error || !data) return undefined;
  return mapRow(data as BlogPostRow);
}

export type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  image: string | null;
  imagePosition: string | null;
  isPublished: boolean;
  videoUrl: string | null;
};

/** Creates a new blog post. Admins only (enforced by RLS). */
export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      author: input.author,
      published_at: input.publishedAt,
      read_time_minutes: input.readTimeMinutes,
      image_url: input.image,
      image_position: input.imagePosition,
      is_published: input.isPublished,
      video_url: input.videoUrl,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createBlogPost error:", error?.message);
    throw new Error(error?.message ?? "Failed to create post.");
  }
  return mapRow(data as BlogPostRow);
}

/** Updates an existing blog post. Admins only (enforced by RLS). */
export async function updateBlogPost(slug: string, input: Omit<BlogPostInput, "slug">): Promise<BlogPost> {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      author: input.author,
      published_at: input.publishedAt,
      read_time_minutes: input.readTimeMinutes,
      image_url: input.image,
      image_position: input.imagePosition,
      is_published: input.isPublished,
      video_url: input.videoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)
    .select()
    .single();

  if (error || !data) {
    console.error("updateBlogPost error:", error?.message);
    throw new Error(error?.message ?? "Failed to update post.");
  }
  return mapRow(data as BlogPostRow);
}

/** Permanently deletes a blog post. Admins only (enforced by RLS). */
export async function deleteBlogPost(slug: string): Promise<void> {
  const { error } = await supabase.from("blog_posts").delete().eq("slug", slug);
  if (error) {
    console.error("deleteBlogPost error:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Uploads a blog photo to Supabase Storage and returns its public URL.
 * Admins only (enforced by storage policies). Overwrites any previous
 * image for the same post (one image per post).
 */
export async function uploadBlogImage(slug: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${slug}/main.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("blog-images")
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (uploadError) {
    console.error("uploadBlogImage error:", uploadError.message);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}