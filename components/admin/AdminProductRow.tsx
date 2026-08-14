"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, formatNaira, setProductActive } from "@/lib/products";

export default function AdminProductRow({
  product,
  onChange,
}: {
  product: Product;
  onChange: () => void;
}) {
  const [updating, setUpdating] = useState(false);

  async function handleToggleActive() {
    setUpdating(true);
    try {
      await setProductActive(product.id, !product.isActive);
      onChange();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-sm font-bold text-charcoal">{product.name}</p>
          {!product.isActive && (
            <span className="rounded-full bg-charcoal/10 px-2 py-0.5 text-[10px] font-semibold text-charcoal/60">
              Inactive
            </span>
          )}
          {product.isFeatured && (
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold-dark">
              Featured
            </span>
          )}
          {product.stockQuantity === 0 && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
              Out of Stock
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-charcoal/50">
          {product.category} · {product.weightOptions.join(" · ")} · Stock: {product.stockQuantity}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className="font-display text-base font-extrabold text-forest">{formatNaira(product.price)}</p>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="rounded-full border border-forest/20 px-3.5 py-1.5 text-xs font-semibold text-forest hover:bg-forest/5"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={handleToggleActive}
          disabled={updating}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold disabled:opacity-50 ${
            product.isActive
              ? "border border-red-200 text-red-600 hover:bg-red-50"
              : "border border-forest/20 text-forest hover:bg-forest/5"
          }`}
        >
          {product.isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );
}