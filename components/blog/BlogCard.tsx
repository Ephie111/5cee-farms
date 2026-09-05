import Link from "next/link";
import Image from "next/image";
import { BlogPost, formatBlogDate, getYouTubeVideoId } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  const videoId = post.videoUrl ? getYouTubeVideoId(post.videoUrl) : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {videoId ? (
        <div className="relative aspect-video w-full bg-charcoal">
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail CDN, not a Next-optimized asset */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </div>
      ) : post.image ? (
        <div className="relative aspect-video w-full">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
            style={{ objectPosition: post.imagePosition ?? "center" }}
          />
        </div>
      ) : (
        <div className="img-placeholder aspect-video w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
          </svg>
          <span className="text-[11px] font-medium">Blog photo</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="w-fit rounded-full bg-forest/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest">
          {post.category}
        </span>
        <h3 className="font-display text-base font-bold leading-snug text-charcoal">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-charcoal/70">{post.excerpt}</p>
        <p className="mt-auto pt-3 text-xs text-charcoal/50">
          {formatBlogDate(post.publishedAt)} · {post.readTimeMinutes} min read
        </p>
      </div>
    </Link>
  );
}