"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import { getDashboardStats, DashboardStats } from "@/lib/admin-stats";
import { formatNaira } from "@/lib/products";

const STATUS_STYLES: Record<string, string> = {
  Processing: "bg-gold/15 text-gold-dark",
  "Out for Delivery": "bg-blue-50 text-blue-700",
  Delivered: "bg-forest/10 text-forest",
  Cancelled: "bg-red-50 text-red-600",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-sm text-charcoal/50">Loading dashboard…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">An overview of how the store is doing.</p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Revenue (Paid)" value={formatNaira(stats.totalRevenue)} />
        <StatCard label="Total Orders" value={String(stats.totalOrders)} />
        <StatCard label="Processing" value={String(stats.ordersByStatus.Processing)} tone="gold" />
        <StatCard label="Out for Delivery" value={String(stats.ordersByStatus["Out for Delivery"])} tone="blue" />
        <StatCard label="Delivered" value={String(stats.ordersByStatus.Delivered)} />
        <StatCard
          label="Out of Stock"
          value={String(stats.outOfStockCount)}
          tone={stats.outOfStockCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-2xl border border-forest/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-forest">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-forest hover:underline">
              View all
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-charcoal/50">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-forest/5">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-charcoal">{order.orderNumber}</p>
                    <p className="text-xs text-charcoal/50">{order.fullName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-display font-bold text-forest">{formatNaira(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="rounded-2xl border border-forest/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-forest">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-xs font-semibold text-forest hover:underline">
              View all
            </Link>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="mt-4 text-sm text-charcoal/50">Nothing running low right now.</p>
          ) : (
            <ul className="mt-4 divide-y divide-forest/5">
              {stats.lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between py-3 text-sm">
                  <Link href={`/admin/products/${product.id}/edit`} className="font-medium text-charcoal hover:text-forest">
                    {product.name}
                  </Link>
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold-dark">
                    {product.stockQuantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}