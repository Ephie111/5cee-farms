"use client";

import { useEffect, useState } from "react";
import OrderCard, { Order as OrderCardOrder } from "@/components/account/OrderCard";
import { getOrdersForUser, Order } from "@/lib/orders";

function toCardOrder(order: Order): OrderCardOrder {
  const itemsSummary = order.items
    .map((line) => `${line.name} (x${line.quantity})`)
    .join(", ");

  return {
    id: order.orderNumber,
    date: new Date(order.createdAt).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    itemsSummary,
    total: order.total,
    status: order.status,
  };
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getOrdersForUser().then(setOrders);
  }, []);

  return (
    <div>
      <span className="section-eyebrow text-gold-dark">Account</span>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Order History</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Track and reorder from your past purchases.
      </p>

      {orders === null ? (
        <div className="mt-16 py-16 text-center text-sm text-charcoal/50">
          Loading your orders…
        </div>
      ) : orders.length > 0 ? (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={toCardOrder(order)} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
          <p>You haven&apos;t placed any orders yet.</p>
        </div>
      )}
    </div>
  );
}