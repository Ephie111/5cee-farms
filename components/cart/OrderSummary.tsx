"use client";

import Link from "next/link";
import { formatNaira } from "@/lib/products";

export default function OrderSummary({
  subtotal,
  deliveryFee = 1500,
  showCheckoutButton = true,
}: {
  subtotal: number;
  deliveryFee?: number;
  showCheckoutButton?: boolean;
}) {
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-6">
      <h2 className="font-display text-base font-bold text-forest">Order Summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-charcoal/60">Subtotal</dt>
          <dd className="font-medium">{formatNaira(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-charcoal/60">Delivery Fee (estimate)</dt>
          <dd className="font-medium">{formatNaira(deliveryFee)}</dd>
        </div>
        <p className="text-xs text-charcoal/45">
          Final delivery fee is calculated at checkout based on your location.
        </p>
      </dl>

      <div className="mt-5 flex justify-between border-t border-forest/10 pt-4">
        <span className="font-display text-base font-bold text-charcoal">Total</span>
        <span className="font-display text-lg font-extrabold text-forest">{formatNaira(total)}</span>
      </div>

      {showCheckoutButton && (
        <Link href="/checkout" className="btn-primary mt-6 w-full">
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}