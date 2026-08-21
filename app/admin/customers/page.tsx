"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAllCustomersAdmin, CustomerSummary } from "@/lib/admin-customers";
import { formatNaira } from "@/lib/products";

type SortKey = "recent" | "spent" | "orders";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[] | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  useEffect(() => {
    getAllCustomersAdmin().then(setCustomers);
  }, []);

  const filtered = useMemo(() => {
    if (!customers) return [];
    const q = search.trim().toLowerCase();
    const matches = customers.filter(
      (c) =>
        !q ||
        (c.fullName ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").includes(q)
    );

    return [...matches].sort((a, b) => {
      if (sort === "spent") return b.totalSpent - a.totalSpent;
      if (sort === "orders") return b.orderCount - a.orderCount;
      // "recent" — most recently joined first
      return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
    });
  }, [customers, search, sort]);

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Customers</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        {customers === null ? "Loading…" : `${customers.length} registered customer${customers.length !== 1 ? "s" : ""}`}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {([
            { key: "recent", label: "Newest" },
            { key: "spent", label: "Top Spenders" },
            { key: "orders", label: "Most Orders" },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSort(opt.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                sort === opt.key ? "bg-forest text-white" : "bg-white text-charcoal/60 hover:bg-forest/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-forest/20 px-3 py-2 text-sm focus:border-forest focus:outline-none sm:w-64"
        />
      </div>

      {customers === null ? (
        <p className="mt-16 text-center text-sm text-charcoal/50">Loading customers…</p>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-forest/20 py-16 text-center text-charcoal/50">
          <p>No customers match this search.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((customer) => (
            <Link
              key={customer.id}
              href={`/admin/customers/${customer.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-5 transition-colors hover:border-forest/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-display text-sm font-bold text-charcoal">
                  {customer.fullName ?? "Unnamed Customer"}
                </p>
                <p className="mt-1 text-xs text-charcoal/50">
                  {customer.email}
                  {customer.phone ? ` · ${customer.phone}` : ""}
                </p>
                <p className="mt-1 text-xs text-charcoal/40">
                  Joined {new Date(customer.joinedAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-charcoal/40">Orders</p>
                  <p className="font-display font-bold text-charcoal">{customer.orderCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-charcoal/40">Total Spent</p>
                  <p className="font-display font-bold text-forest">{formatNaira(customer.totalSpent)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}