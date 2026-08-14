"use client";

import Link from "next/link";
import { Product, formatNaira } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      weight: product.weightOptions[0] ?? product.unit,
      price: product.price,
      quantity: 1,
    });
  }
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image placeholder — swap for a real product photo */}
      <Link href={`/product/${product.id}`} className="img-placeholder relative aspect-square w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
        </svg>
        <span className="text-[11px] font-medium">Product photo</span>
        {product.stockQuantity === 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-charcoal px-2.5 py-1 text-[10px] font-semibold text-white">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-forest/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`} className="font-display text-sm font-bold leading-snug text-charcoal hover:text-forest">
          {product.name}
        </Link>
        <p className="text-xs text-charcoal/60">{product.weightOptions.join(" · ")}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-base font-extrabold text-forest">
            {formatNaira(product.price)}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:bg-charcoal/10 disabled:text-charcoal/40 disabled:hover:bg-charcoal/10"
          >
            {product.stockQuantity === 0 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}