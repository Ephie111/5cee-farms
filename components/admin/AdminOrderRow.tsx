"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/products";
import { Order, OrderStatus } from "@/lib/orders";

const STATUS_OPTIONS: OrderStatus[] = ["Processing", "Out for Delivery", "Delivered", "Cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Processing: "bg-gold/15 text-gold-dark",
  "Out for Delivery": "bg-blue-50 text-blue-700",
  Delivered: "bg-forest/10 text-forest",
  Cancelled: "bg-red-50 text-red-600",
};

const PAYMENT_STYLES: Record<string, string> = {
  paid: "bg-forest/10 text-forest",
  pending: "bg-gold/15 text-gold-dark",
  failed: "bg-red-50 text-red-600",
};

export default function AdminOrderRow({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleStatusChange(newStatus: OrderStatus) {
    setUpdating(true);
    try {
      await onStatusChange(order.id, newStatus);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-sm font-bold text-charcoal">{order.orderNumber}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PAYMENT_STYLES[order.paymentStatus]}`}>
              {order.paymentStatus === "paid" ? "Paid" : order.paymentMethod === "pod" ? "Pay on Delivery" : "Payment Pending"}
            </span>
          </div>
          <p className="mt-1 text-xs text-charcoal/50">
            {new Date(order.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
            {" · "}
            {order.fullName} · {order.phone}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="font-display text-base font-extrabold text-forest">{formatNaira(order.total)}</p>
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50 ${STATUS_STYLES[order.status]}`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-charcoal/60 hover:bg-forest/5"
          >
            {expanded ? "Hide" : "Details"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-forest/10 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Delivery Address</p>
              <p className="mt-1 text-sm text-charcoal/80">
                {order.address}, {order.city}, {order.state}
              </p>
              {order.deliveryDate && (
                <p className="mt-1 text-xs text-charcoal/50">
                  {new Date(order.deliveryDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                  {order.deliverySlot ? ` · ${order.deliverySlot}` : ""}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Items</p>
              <ul className="mt-1 space-y-1 text-sm text-charcoal/80">
                {order.items.map((line) => (
                  <li key={line.id}>
                    {line.name} ({line.weight}) × {line.quantity} — {formatNaira(line.price * line.quantity)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}