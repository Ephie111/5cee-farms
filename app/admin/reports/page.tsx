"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import { getReportsData, ReportsData, DateRangeOption } from "@/lib/admin-reports";
import { formatNaira } from "@/lib/products";

const RANGE_OPTIONS: { key: DateRangeOption; label: string }[] = [
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "90d", label: "Last 90 Days" },
  { key: "all", label: "All Time" },
];

const STATUS_COLORS: Record<string, string> = {
  Processing: "#D4A017",
  "Out for Delivery": "#2563EB",
  Delivered: "#1B5E20",
  Cancelled: "#DC2626",
};

function formatChartDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}
export default function AdminReportsPage() {
  const [range, setRange] = useState<DateRangeOption>("30d");
  const [data, setData] = useState<ReportsData | null>(null);

  useEffect(() => {
    setData(null);
    getReportsData(range).then(setData);
  }, [range]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Reports &amp; Analytics</h1>
          <p className="mt-1 text-sm text-charcoal/60">Sales trends over time.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setRange(opt.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                range === opt.key ? "bg-forest text-white" : "bg-white text-charcoal/60 hover:bg-forest/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {!data ? (
        <p className="mt-16 text-center text-sm text-charcoal/50">Loading report…</p>
      ) : (
        <>
          {/* Summary stats for the selected period */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Revenue (Paid)" value={formatNaira(data.totalRevenue)} />
            <StatCard label="Total Orders" value={String(data.totalOrders)} />
            <StatCard label="Average Order Value" value={formatNaira(Math.round(data.averageOrderValue))} />
          </div>

          {/* Revenue by day — plain list instead of a chart, so it's readable
              for anyone regardless of comfort reading graphs */}
          <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-5">
            <h2 className="font-display text-sm font-bold text-forest">Revenue by Day</h2>
            {data.revenueOverTime.length === 0 ? (
              <p className="mt-4 py-8 text-center text-sm text-charcoal/50">
                No paid orders in this period yet.
              </p>
            ) : (
              <>
                <ul className="mt-4 divide-y divide-forest/5">
                  {[...data.revenueOverTime]
                    .sort((a, b) => b.date.localeCompare(a.date)) // most recent first
                    .slice(0, 20)
                    .map((point) => {
                      const max = Math.max(...data.revenueOverTime.map((p) => p.revenue));
                      return (
                        <li key={point.date} className="py-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-charcoal">
                              {new Date(point.date).toLocaleDateString("en-NG", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="text-charcoal/60">
                              {point.orders} order{point.orders !== 1 ? "s" : ""} · {formatNaira(point.revenue)}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-forest/5">
                            <div
                              className="h-full rounded-full bg-forest"
                              style={{ width: `${(point.revenue / max) * 100}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                </ul>
                {data.revenueOverTime.length > 20 && (
                  <p className="mt-3 text-xs text-charcoal/40">
                    Showing the most recent 20 days. Narrow the date range above for a shorter list.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Best sellers by quantity */}
            <div className="rounded-2xl border border-forest/10 bg-white p-5">
              <h2 className="font-display text-sm font-bold text-forest">Best Sellers (by Quantity)</h2>
              {data.topProductsByQuantity.length === 0 ? (
                <p className="mt-4 text-sm text-charcoal/50">No sales data yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.topProductsByQuantity.map((p, i) => {
                    const max = data.topProductsByQuantity[0].quantitySold;
                    return (
                      <li key={p.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-charcoal">{i + 1}. {p.name}</span>
                          <span className="text-charcoal/60">{p.quantitySold} sold</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-forest/5">
                          <div
                            className="h-full rounded-full bg-gold"
                            style={{ width: `${(p.quantitySold / max) * 100}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Top revenue-generating products */}
            <div className="rounded-2xl border border-forest/10 bg-white p-5">
              <h2 className="font-display text-sm font-bold text-forest">Top Products (by Revenue)</h2>
              {data.topProductsByRevenue.length === 0 ? (
                <p className="mt-4 text-sm text-charcoal/50">No sales data yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.topProductsByRevenue.map((p, i) => {
                    const max = data.topProductsByRevenue[0].revenue;
                    return (
                      <li key={p.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-charcoal">{i + 1}. {p.name}</span>
                          <span className="text-charcoal/60">{formatNaira(p.revenue)}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-forest/5">
                          <div
                            className="h-full rounded-full bg-forest"
                            style={{ width: `${(p.revenue / max) * 100}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Payment method breakdown */}
            <div className="rounded-2xl border border-forest/10 bg-white p-5">
              <h2 className="font-display text-sm font-bold text-forest">Payment Methods</h2>
              {data.paymentMethodBreakdown.length === 0 ? (
                <p className="mt-4 text-sm text-charcoal/50">No paid orders yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.paymentMethodBreakdown.map((m) => {
                    const max = data.paymentMethodBreakdown[0].revenue;
                    return (
                      <li key={m.method}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-charcoal">{m.label}</span>
                          <span className="text-charcoal/60">{m.count} order{m.count !== 1 ? "s" : ""} · {formatNaira(m.revenue)}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-forest/5">
                          <div
                            className="h-full rounded-full bg-leaf"
                            style={{ width: `${(m.revenue / max) * 100}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Order status breakdown */}
            <div className="rounded-2xl border border-forest/10 bg-white p-5">
              <h2 className="font-display text-sm font-bold text-forest">Order Status</h2>
              {data.statusBreakdown.length === 0 ? (
                <p className="mt-4 text-sm text-charcoal/50">No orders in this period.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.statusBreakdown.map((s) => {
                    const max = Math.max(...data.statusBreakdown.map((x) => x.count));
                    return (
                      <li key={s.status}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-charcoal">{s.status}</span>
                          <span className="text-charcoal/60">{s.count} order{s.count !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-forest/5">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(s.count / max) * 100}%`,
                              backgroundColor: STATUS_COLORS[s.status] ?? "#1B5E20",
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}