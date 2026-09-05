"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import BlogVideoEmbed from "@/components/blog/BlogVideoEmbed";
import { getBlogPostBySlug, getRelatedBlogPosts, formatBlogDate, BlogPost } from "@/lib/blog";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [related, setRelated] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    getBlogPostBySlug(params.slug).then((found) => {
      if (cancelled) return;
      setPost(found ?? null);
      if (found) getRelatedBlogPosts(found).then((r) => !cancelled && setRelated(r));
    });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (post === undefined) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center text-sm text-charcoal/50">
          Loading…
        </main>
        <Footer />
      </>
    );
  }

  if (post === null) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="text-charcoal/60">We couldn&apos;t find that post.</p>
          <Link href="/blog" className="btn-primary mt-6 inline-flex">Back to Blog</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <article className="mx-auto max-w-3xl px-6 py-14 lg:px-10">
          <Link href="/blog" className="text-xs font-semibold text-forest hover:underline">
            ← Back to Blog
          </Link>

          <span className="mt-4 block w-fit rounded-full bg-forest/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest">
            {post.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-charcoal/50">
            {post.author} · {formatBlogDate(post.publishedAt)} · {post.readTimeMinutes} min read
          </p>

          {post.videoUrl ? (
            <div className="mt-8">
              <BlogVideoEmbed videoUrl={post.videoUrl} title={post.title} />
            </div>
          ) : post.image ? (
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                style={{ objectPosition: post.imagePosition ?? "center" }}
                priority
              />
            </div>
          ) : (
            <div className="img-placeholder mt-8 aspect-video w-full rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
              </svg>
              <span className="text-xs font-medium">Blog photo</span>
            </div>
          )}

          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-charcoal/80">
            {post.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 pb-14 lg:px-10">
            <h2 className="text-xl font-bold">More in {post.category}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}