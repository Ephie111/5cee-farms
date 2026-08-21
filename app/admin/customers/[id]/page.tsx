"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminOrderRow from "@/components/admin/AdminOrderRow";
import { getCustomerByIdAdmin } from "@/lib/admin-customers";
import { getOrdersForCustomerAdmin, updateOrderStatus, Order, OrderStatus } from "@/lib/orders";
import { formatNaira } from "@/lib/products";

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<{ id: string; fullName: string | null; email: string | null; joinedAt: string } | null | undefined>(undefined);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getCustomerByIdAdmin(params.id).then((found) => setCustomer(found ?? null));
    getOrdersForCustomerAdmin(params.id).then(setOrders);
  }, [params.id]);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status);
    setOrders((prev) => prev?.map((o) => (o.id === orderId ? { ...o, status } : o)) ?? null);
  }

  if (customer === undefined) {
    return <p className="text-sm text-charcoal/50">Loading customer…</p>;
  }
  if (customer === null) {
    return <p className="text-sm text-charcoal/50">Customer not found.</p>;
  }

  const totalSpent = (orders ?? [])
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const latestOrder = orders?.[0];

  return (
    <div>
      <Link href="/admin/customers" className="text-xs font-semibold text-forest hover:underline">
        ← Back to Customers
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{customer.fullName ?? "Unnamed Customer"}</h1>
          <p className="mt-1 text-sm text-charcoal/60">{customer.email}</p>
          {latestOrder && (
            <p className="mt-1 text-sm text-charcoal/60">
              {latestOrder.phone} · {latestOrder.address}, {latestOrder.city}, {latestOrder.state}
            </p>
          )}
          <p className="mt-1 text-xs text-charcoal/40">
            Joined {new Date(customer.joinedAt).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="rounded-2xl border border-forest/10 bg-white px-5 py-3 text-center">
            <p className="text-xs uppercase tracking-wide text-charcoal/40">Orders</p>
            <p className="font-display text-xl font-extrabold text-charcoal">{orders?.length ?? "—"}</p>
          </div>
          <div className="rounded-2xl border border-forest/10 bg-white px-5 py-3 text-center">
            <p className="text-xs uppercase tracking-wide text-charcoal/40">Total Spent</p>
            <p className="font-display text-xl font-extrabold text-forest">{formatNaira(totalSpent)}</p>
          </div>
        </div>
      </div>

      <h2 className="mt-8 font-display text-sm font-bold text-forest">Order History</h2>
      {orders === null ? (
        <p className="mt-4 text-sm text-charcoal/50">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-forest/20 py-12 text-center text-sm text-charcoal/50">
          This customer hasn&apos;t placed any orders yet.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <AdminOrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}