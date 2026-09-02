"use client";

import { useState } from "react";
import Image from "next/image";

const PLACEHOLDER_COUNT = 4;

function PlaceholderIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
    </svg>
  );
}

export default function ImageGallery({
  productName,
  imageUrl,
}: {
  productName: string;
  /** Real uploaded photo, if one exists — only one photo is supported per product for now. */
  imageUrl?: string | null;
}) {
  const [active, setActive] = useState(0);

  if (imageUrl) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <Image src={imageUrl} alt={productName} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
      </div>
    );
  }

  return (
    <div>
      {/* Main image placeholder */}
      <div className="img-placeholder aspect-square w-full rounded-2xl">
        <PlaceholderIcon className="h-12 w-12" />
        <span className="text-xs font-medium">Photo {active + 1} — {productName}</span>
      </div>

      {/* Thumbnail placeholders */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`img-placeholder aspect-square rounded-xl transition-all ${
              active === i ? "ring-2 ring-forest" : "opacity-70 hover:opacity-100"
            }`}
          >
            <PlaceholderIcon className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  );
}