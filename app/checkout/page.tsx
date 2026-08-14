"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeliveryForm, { DeliveryDetails } from "@/components/checkout/DeliveryForm";
import PaymentMethodSelector, { PaymentMethodId } from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { createOrder } from "@/lib/orders";
import { payWithPaystack } from "@/lib/paystack";

const DELIVERY_FEE = 1500;

const EMPTY_DELIVERY: DeliveryDetails = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "Awka",
  state: "Anambra",
  deliveryDate: "",
  deliverySlot: "9:00 AM – 12:00 PM",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [delivery, setDelivery] = useState<DeliveryDetails>(EMPTY_DELIVERY);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    setError(null);

    if (!user) {
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!delivery.fullName || !delivery.phone || !delivery.address) {
      setError("Please fill in your name, phone number, and delivery address.");
      return;
    }

    setSubmitting(true);
    try {
      const total = subtotal + DELIVERY_FEE;
      let paymentStatus: "pending" | "paid" = "pending";
      let paystackReference: string | undefined;

      if (paymentMethod !== "pod") {
        // Card / Bank Transfer / USSD all go through Paystack's popup —
        // it shows the right payment form based on which channel we pass.
        const channelsByMethod: Record<Exclude<PaymentMethodId, "pod">, ("card" | "bank" | "ussd" | "bank_transfer")[]> = {
          card: ["card"],
          transfer: ["bank_transfer", "bank"],
          ussd: ["ussd"],
        };

        const reference = await payWithPaystack({
          email: delivery.email || user.email || "",
          amountNaira: total,
          channels: channelsByMethod[paymentMethod as Exclude<PaymentMethodId, "pod">],
        });

        if (!reference) {
          // Customer closed the payment popup without paying — not an
          // error, just stop here and let them try again.
          setSubmitting(false);
          return;
        }

        // Never trust the popup closing "successfully" on its own —
        // always confirm with Paystack's server before treating this as paid.
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const verifyData = await verifyRes.json();

        if (!verifyData.verified) {
          setError("We couldn't verify your payment. Please try again, or choose Pay on Delivery.");
          setSubmitting(false);
          return;
        }

        paymentStatus = "paid";
        paystackReference = reference;
      }

      const order = await createOrder({
        items,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        fullName: delivery.fullName,
        phone: delivery.phone,
        email: delivery.email || undefined,
        address: delivery.address,
        city: delivery.city,
        state: delivery.state,
        deliveryDate: delivery.deliveryDate || undefined,
        deliverySlot: delivery.deliverySlot || undefined,
        paymentMethod,
        paymentStatus,
        paystackReference,
      });

      clearCart();
      router.push(`/order-confirmation?order=${order.orderNumber}`);
    } catch (err) {
      console.error("Place order error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong placing your order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <nav className="text-xs text-charcoal/50">
          <Link href="/cart" className="hover:text-forest">Cart</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">Checkout</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Checkout</h1>

        {!authLoading && !user && (
          <div className="mt-4 rounded-xl bg-gold/10 px-4 py-3 text-sm text-gold-dark">
            You&apos;ll need to{" "}
            <Link href="/login" className="font-semibold underline">log in</Link> before placing an order.
          </div>
        )}

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-20 text-center">
            <p className="text-charcoal/60">Your cart is empty.</p>
            <Link href="/shop" className="btn-primary mt-6 inline-flex">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:items-start">
            <div className="space-y-6 lg:col-span-2">
              <DeliveryForm value={delivery} onChange={setDelivery} />
              <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
            </div>

            <div className="space-y-4">
              <OrderSummary
                subtotal={subtotal}
                deliveryFee={DELIVERY_FEE}
                showCheckoutButton={false}
              />

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60"
              >
                {submitting
                  ? "Processing…"
                  : paymentMethod === "pod"
                    ? "Place Order"
                    : "Pay & Place Order"}
              </button>
              <p className="text-center text-xs text-charcoal/50">
                By placing your order you agree to our{" "}
                <Link href="/policies" className="text-forest underline">
                  Return &amp; Delivery Policy
                </Link>
                .
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}