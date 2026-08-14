import Link from "next/link";
import { formatNaira } from "@/lib/products";

export type OrderStatus = "Processing" | "Out for Delivery" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  date: string;
  itemsSummary: string;
  total: number;
  status: OrderStatus;
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  Processing: "bg-gold/15 text-gold-dark",
  "Out for Delivery": "bg-blue-50 text-blue-700",
  Delivered: "bg-forest/10 text-forest",
  Cancelled: "bg-red-50 text-red-600",
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-sm font-bold text-charcoal">{order.id}</p>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
        </div>
        <p className="mt-1 text-xs text-charcoal/50">{order.date}</p>
        <p className="mt-1.5 text-sm text-charcoal/70">{order.itemsSummary}</p>
      </div>

      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
        <p className="font-display text-base font-extrabold text-forest">
          {formatNaira(order.total)}
        </p>
        <div className="flex gap-2">
          <Link
            href="/shop"
            className="rounded-full border border-forest/20 px-3.5 py-1.5 text-xs font-semibold text-forest transition-colors hover:bg-forest/5"
          >
            Reorder
          </Link>
          <button
            type="button"
            className="rounded-full border border-forest/20 px-3.5 py-1.5 text-xs font-semibold text-charcoal/60 transition-colors hover:bg-forest/5"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}