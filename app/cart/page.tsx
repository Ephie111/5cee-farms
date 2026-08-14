"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Your Cart</h1>
        <p className="mt-1 text-sm text-charcoal/60">
          {items.length} item{items.length !== 1 ? "s" : ""} in your cart
        </p>

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-20 text-center">
            <p className="text-charcoal/60">Your cart is empty.</p>
            <Link href="/shop" className="btn-primary mt-6 inline-flex">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:items-start">
            <div className="rounded-2xl border border-forest/10 bg-white p-6 lg:col-span-2">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
              <Link href="/shop" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-forest hover:underline">
                ← Continue Shopping
              </Link>
            </div>

            <OrderSummary subtotal={subtotal} />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}