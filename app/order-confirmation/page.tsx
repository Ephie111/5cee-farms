"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfirmationSummary from "@/components/order-confirmation/ConfirmationSummary";
import { getOrderByNumber, Order } from "@/lib/orders";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    if (!orderNumber) {
      setOrder(null);
      return;
    }
    getOrderByNumber(orderNumber).then((found) => setOrder(found ?? null));
  }, [orderNumber]);

  if (order === undefined) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center text-sm text-charcoal/50">
          Loading your order…
        </main>
        <Footer />
      </>
    );
  }

  if (order === null) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="text-charcoal/60">We couldn&apos;t find that order.</p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const estimatedDelivery = order.deliveryDate
    ? `${new Date(order.deliveryDate).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })}${order.deliverySlot ? ` · ${order.deliverySlot}` : ""}`
    : "We'll confirm your delivery window shortly";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">Order Confirmed!</h1>
          <p className="mt-2 text-sm text-charcoal/60">
            Thank you, {order.fullName.split(" ")[0]} — your order has been received.
          </p>
        </div>

        <div id="printable-receipt" className="mt-10">
          {/* Header shown only when printing/saving as PDF — the on-screen
              site Header above is hidden for print via the CSS in globals.css */}
          <div className="receipt-print-header hidden">
            <p className="font-display text-lg font-bold text-forest">5CEE FARMS LTD</p>
            <p className="text-xs text-charcoal/60">Chiso Foods · NKPAGU Farmland, Obodo Adaka, Ifite Awka, Awka South LGA, Anambra State</p>
            <p className="text-xs text-charcoal/60">
              {new Date(order.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <h2 className="mt-3 text-base font-bold">Order Receipt</h2>
          </div>

          <ConfirmationSummary
            orderNumber={order.orderNumber}
            items={order.items.map((line) => ({
              id: line.id,
              name: line.name,
              weight: line.weight,
              quantity: line.quantity,
              price: line.price,
            }))}
            deliveryFee={order.deliveryFee}
            estimatedDelivery={estimatedDelivery}
            paymentStatus={order.paymentStatus}
            paymentMethod={order.paymentMethod}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-secondary flex-1 text-forest! border-forest/30!"
          >
            Download Receipt
          </button>
          <Link href="/shop" className="btn-primary flex-1 text-center">
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-charcoal/50 print:hidden">
          Questions about your order?{" "}
          <a href="https://wa.me/2347061302674" target="_blank" rel="noreferrer" className="text-forest underline">
            Chat with us on WhatsApp
          </a>{" "}
          or call 0706 130 2674.
        </p>
      </main>
      <Footer />
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="mx-auto max-w-3xl px-6 py-24 text-center text-sm text-charcoal/50">
            Loading your order…
          </main>
          <Footer />
        </>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}