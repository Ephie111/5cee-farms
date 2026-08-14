"use client";

import Link from "next/link";
import { formatNaira } from "@/lib/products";
import { CartLine } from "@/lib/cart-context";

export default function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartLine;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-forest/10 py-5 last:border-none">
      {/* Image placeholder */}
      <Link href={`/product/${item.productId}`} className="img-placeholder h-20 w-20 shrink-0 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
        </svg>
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/product/${item.productId}`} className="font-display text-sm font-bold text-charcoal hover:text-forest">
          {item.name}
        </Link>
        <p className="mt-0.5 text-xs text-charcoal/60">{item.weight}</p>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="mt-2 text-xs font-medium text-gold-dark hover:underline"
        >
          Remove
        </button>
      </div>

      <div className="flex items-center rounded-full border border-forest/20">
        <button
          type="button"
          onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
          className="flex h-9 w-9 items-center justify-center text-base font-semibold text-forest"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="flex h-9 w-9 items-center justify-center text-base font-semibold text-forest"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <p className="w-24 shrink-0 text-right font-display text-sm font-bold text-forest">
        {formatNaira(item.price * item.quantity)}
      </p>
    </div>
  );
}