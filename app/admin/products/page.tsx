"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminProductRow from "@/components/admin/AdminProductRow";
import { getAllProductsAdmin, Product } from "@/lib/products";

const FILTERS = ["All", "Active", "Inactive", "Out of Stock"] as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");

  async function refresh() {
    const data = await getAllProductsAdmin();
    setProducts(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && p.isActive) ||
        (filter === "Inactive" && !p.isActive) ||
        (filter === "Out of Stock" && p.stockQuantity === 0);
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [products, filter, search]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {products === null ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === f ? "bg-forest text-white" : "bg-white text-charcoal/60 hover:bg-forest/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-forest/20 px-3 py-2 text-sm focus:border-forest focus:outline-none sm:w-64"
        />
      </div>

      {products === null ? (
        <p className="mt-16 text-center text-sm text-charcoal/50">Loading products…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
          <p>No products match this view.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((product) => (
            <AdminProductRow key={product.id} product={product} onChange={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}