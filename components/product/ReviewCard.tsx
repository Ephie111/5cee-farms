import StarRating from "@/components/StarRating";

export type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
};

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex gap-4 border-b border-forest/10 py-5 last:border-none">
      <div className="img-placeholder h-10 w-10 shrink-0 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-sm font-bold text-charcoal">{review.name}</p>
          <StarRating rating={review.rating} />
          <span className="text-xs text-charcoal/50">{review.date}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-charcoal/75">{review.comment}</p>
      </div>
    </div>
  );
}