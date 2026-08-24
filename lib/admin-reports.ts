import { getAllOrdersAdmin, Order } from "./orders";

export type DateRangeOption = "7d" | "30d" | "90d" | "all";

export type RevenuePoint = { date: string; revenue: number; orders: number };
export type ProductSales = { name: string; quantitySold: number; revenue: number };
export type PaymentMethodBreakdown = { method: string; label: string; count: number; revenue: number };
export type StatusBreakdown = { status: string; count: number };

export type ReportsData = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueOverTime: RevenuePoint[];
  topProductsByQuantity: ProductSales[];
  topProductsByRevenue: ProductSales[];
  paymentMethodBreakdown: PaymentMethodBreakdown[];
  statusBreakdown: StatusBreakdown[];
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: "Card",
  transfer: "Bank Transfer",
  ussd: "USSD",
  pod: "Pay on Delivery",
};

function filterByRange(orders: Order[], range: DateRangeOption): Order[] {
  if (range === "all") return orders;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return orders.filter((o) => new Date(o.createdAt) >= cutoff);
}

/**
 * Builds historical sales trends and breakdowns from the same order
 * data every other admin page already uses — no separate analytics
 * table needed. Computed client-side, fine at this store's scale.
 */
export async function getReportsData(range: DateRangeOption): Promise<ReportsData> {
  const allOrders = await getAllOrdersAdmin();
  const orders = filterByRange(allOrders, range);
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // Revenue over time — grouped by calendar day
  const revenueByDate = new Map<string, { revenue: number; orders: number }>();
  for (const order of paidOrders) {
    const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
    const existing = revenueByDate.get(dateKey) ?? { revenue: 0, orders: 0 };
    existing.revenue += order.total;
    existing.orders += 1;
    revenueByDate.set(dateKey, existing);
  }
  const revenueOverTime: RevenuePoint[] = Array.from(revenueByDate.entries())
    .map(([date, v]) => ({ date, revenue: v.revenue, orders: v.orders }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Best-selling products — read straight from each order's item snapshot
  const productMap = new Map<string, { quantitySold: number; revenue: number }>();
  for (const order of paidOrders) {
    for (const line of order.items) {
      const existing = productMap.get(line.name) ?? { quantitySold: 0, revenue: 0 };
      existing.quantitySold += line.quantity;
      existing.revenue += line.price * line.quantity;
      productMap.set(line.name, existing);
    }
  }
  const productList: ProductSales[] = Array.from(productMap.entries()).map(([name, v]) => ({ name, ...v }));
  const topProductsByQuantity = [...productList].sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 6);
  const topProductsByRevenue = [...productList].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

  // Payment method breakdown
  const methodMap = new Map<string, { count: number; revenue: number }>();
  for (const order of paidOrders) {
    const existing = methodMap.get(order.paymentMethod) ?? { count: 0, revenue: 0 };
    existing.count += 1;
    existing.revenue += order.total;
    methodMap.set(order.paymentMethod, existing);
  }
  const paymentMethodBreakdown: PaymentMethodBreakdown[] = Array.from(methodMap.entries())
    .map(([method, v]) => ({ method, label: PAYMENT_METHOD_LABELS[method] ?? method, ...v }))
    .sort((a, b) => b.revenue - a.revenue);

  // Order status breakdown (every order in range, not just paid ones)
  const statusMap = new Map<string, number>();
  for (const order of orders) {
    statusMap.set(order.status, (statusMap.get(order.status) ?? 0) + 1);
  }
  const statusBreakdown: StatusBreakdown[] = Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    revenueOverTime,
    topProductsByQuantity,
    topProductsByRevenue,
    paymentMethodBreakdown,
    statusBreakdown,
  };
}