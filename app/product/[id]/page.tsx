"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/product/ImageGallery";
import ReviewCard, { Review } from "@/components/product/ReviewCard";
import RelatedProducts from "@/components/product/RelatedProducts";
import { getProductById, getRelatedProducts, formatNaira, Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

const MOCK_REVIEWS: Review[] = [
  { id: "r1", name: "Ngozi A.", rating: 5, date: "2 weeks ago", comment: "Very fresh, no smell, cooked beautifully. Will order again." },
  { id: "r2", name: "Emeka O.", rating: 4, date: "1 month ago", comment: "Good quality and the delivery rider was on time." },
  { id: "r3", name: "Blessing U.", rating: 5, date: "1 month ago", comment: "Best chicken I've bought online in Anambra. Highly recommend." },
];

const TABS = ["Description", "Freshness & Handling", `Reviews`] as const;

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined = loading
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Description");
  const [addedMessage, setAddedMessage] = useState(false);

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      weight: selectedWeight,
      price: product.price,
      quantity,
    });
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  }

  useEffect(() => {
    let cancelled = false;
    getProductById(params.id).then((found) => {
      if (cancelled) return;
      setProduct(found ?? null);
      setSelectedWeight(found?.weightOptions[0] ?? "");
      if (found) {
        getRelatedProducts(found).then((r) => !cancelled && setRelated(r));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (product === undefined) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center text-charcoal/50">
          Loading product…
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-3 text-charcoal/60">
            This product may have been removed or the link is incorrect.
          </p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-charcoal/50">
          <Link href="/shop" className="hover:text-forest">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-12 lg:grid-cols-2">
          <ImageGallery productName={product.name} imageUrl={product.imageUrl} />

          <div>
            <span className="w-fit rounded-full bg-forest/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest">
              {product.category}
            </span>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{product.name}</h1>

            <p className="mt-5 font-display text-3xl font-extrabold text-forest">
              {formatNaira(product.price)}
            </p>
            <p className="mt-1 text-sm text-charcoal/60">Price per unit selected below</p>

            {/* Weight selector */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
                Weight / Pack Size
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.weightOptions.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setSelectedWeight(weight)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedWeight === weight
                        ? "border-forest bg-forest text-white"
                        : "border-forest/20 text-charcoal hover:border-forest"
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-forest/20">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-forest"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-forest"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button type="button" onClick={handleAddToCart} className="btn-primary flex-1">
                {addedMessage ? "Added to Cart ✓" : `Add to Cart — ${formatNaira(product.price * quantity)}`}
              </button>
            </div>

            {/* Freshness quick badges */}
            <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.freshness.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-charcoal/70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabs: Description / Freshness & Handling / Reviews */}
        <div className="mt-16">
          <div className="flex gap-6 border-b border-forest/10">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "border-forest text-forest"
                    : "border-transparent text-charcoal/50 hover:text-charcoal"
                }`}
              >
                {tab === "Reviews" ? `Reviews (${product.reviewCount})` : tab}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "Description" && (
              <p className="max-w-2xl text-sm leading-relaxed text-charcoal/75">
                {product.description}
              </p>
            )}
            {activeTab === "Freshness & Handling" && (
              <ul className="max-w-2xl space-y-2 text-sm text-charcoal/75">
                {product.freshness.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
                <li>• Keep refrigerated and cook thoroughly before consumption.</li>
              </ul>
            )}
            {activeTab === "Reviews" && (
              <div className="max-w-2xl">
                {MOCK_REVIEWS.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                <button type="button" className="btn-secondary mt-4 text-forest! border-forest/30!">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        <RelatedProducts products={related} />
      </main>
      <Footer />
    </>
  );
}