import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  const products = (await getFeaturedProducts()) ?? [];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="section-eyebrow">Fresh Off The Farm</span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Featured Products</h2>
        </div>
        <Link href="/shop" className="btn-primary">
          View All Products
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-forest/20 py-12 text-center text-sm text-charcoal/50">
          No featured products yet — check back soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}