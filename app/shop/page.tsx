"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ShopFilters, { ShopFilterState } from "@/components/shop/ShopFilters";
import { getAllProducts, Product } from "@/lib/products";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name: A–Z" },
] as const;

const DEFAULT_FILTERS: ShopFilterState = {
  categories: [],
  weightBands: [],
  maxPrice: Infinity, // no ceiling until we know the real product prices
};

function weightBandOf(weightOptions: string[]): string {
  const first = weightOptions[0] ?? "";
  const match = first.match(/([\d.]+)\s*(kg|g)/i);
  if (!match) return "1kg – 2kg"; // e.g. "Per bird"
  const value = parseFloat(match[1]);
  const kg = match[2].toLowerCase() === "g" ? value / 1000 : value;
  if (kg < 1) return "Under 1kg";
  if (kg <= 2) return "1kg – 2kg";
  return "Over 2kg";
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ShopFilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("featured");

  useEffect(() => {
    getAllProducts()
      .then((fetched) => {
        setProducts(fetched);
        // Set the price ceiling to the actual highest price in the catalog,
        // so nothing is hidden by a stale/guessed default.
        const highest = fetched.reduce((max, p) => Math.max(max, p.price), 2000);
        setFilters((prev) => ({ ...prev, maxPrice: highest }));
      })
      .finally(() => setLoading(false));
  }, []);

  const maxPossiblePrice = useMemo(
    () => products.reduce((max, p) => Math.max(max, p.price), 2000),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCategory =
        filters.categories.length === 0 || filters.categories.includes(p.category);
      const matchesWeight =
        filters.weightBands.length === 0 ||
        filters.weightBands.includes(weightBandOf(p.weightOptions));
      const matchesPrice = p.price <= filters.maxPrice;
      return matchesCategory && matchesWeight && matchesPrice;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return list;
  }, [products, filters, sort]);

  return (
    <>
      <Header />
      <main>
        <section className="bg-forest py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">Full Catalog</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Shop All Products
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/70">
              Fresh whole chickens, cuts, offal and live birds — all raised and
              processed at 5CEE Farms.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row">
            <ShopFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters({ ...DEFAULT_FILTERS, maxPrice: maxPossiblePrice })}
              maxPossiblePrice={maxPossiblePrice}
            />

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-charcoal/60">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-charcoal/60">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="rounded-lg border border-forest/20 bg-white px-3 py-1.5 text-sm font-medium text-charcoal focus:border-forest focus:outline-none"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {loading ? (
                <div className="mt-16 py-16 text-center text-charcoal/50">
                  Loading products…
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
                  No products match your filters. Try resetting them.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}