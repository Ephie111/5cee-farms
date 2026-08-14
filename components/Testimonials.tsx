import { TESTIMONIALS } from "@/lib/testimonials";
import StarRating from "./StarRating";

export default function Testimonials() {
  return (
    <section className="bg-forest/[0.03] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow">Customer Love</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">What Families Are Saying</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
            >
              <StarRating rating={t.rating} size="md" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="img-placeholder h-10 w-10 shrink-0 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-charcoal">{t.name}</p>
                  <p className="text-xs text-charcoal/60">{t.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}