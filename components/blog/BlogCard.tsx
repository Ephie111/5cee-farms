import Link from "next/link";
import { BlogPost, formatBlogDate } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image placeholder — swap for a real photo per post */}
      <div className="img-placeholder aspect-video w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
        </svg>
        <span className="text-[11px] font-medium">Blog photo</span>
      </div>

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