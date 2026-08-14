"use client";

import { useEffect, useMemo, useState } from "react";
import AdminOrderRow from "@/components/admin/AdminOrderRow";
import { getAllOrdersAdmin, updateOrderStatus, Order, OrderStatus } from "@/lib/orders";

const FILTERS: (OrderStatus | "All")[] = ["All", "Processing", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllOrdersAdmin().then(setOrders);
  }, []);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status);
    // Update locally rather than re-fetching everything — snappier for the admin.
    setOrders((prev) => prev?.map((o) => (o.id === orderId ? { ...o, status } : o)) ?? null);
  }

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesFilter = filter === "All" || order.status === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.fullName.toLowerCase().includes(q) ||
        order.phone.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        {orders === null ? "Loading…" : `${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
      </p>

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
          placeholder="Search order #, name, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-forest/20 px-3 py-2 text-sm focus:border-forest focus:outline-none sm:w-64"
        />
      </div>

      {orders === null ? (
        <p className="mt-16 text-center text-sm text-charcoal/50">Loading orders…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
          <p>No orders match this view.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((order) => (
            <AdminOrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}