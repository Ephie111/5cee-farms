import { getAllOrdersAdmin, Order, OrderStatus } from "./orders";
import { getAllProductsAdmin, Product } from "./products";

export type DashboardStats = {
  totalRevenue: number; // sum of paid orders only — pending/failed haven't actually been collected
  totalOrders: number;
  ordersByStatus: Record<OrderStatus, number>;
  recentOrders: Order[]; // most recent 5
  lowStockProducts: Product[]; // active products at or below the threshold
  outOfStockCount: number;
};

const LOW_STOCK_THRESHOLD = 10;

/**
 * Computes dashboard stats client-side from the same admin order/product
 * lists used elsewhere in the admin panel. Fine at this store's scale —
 * if the catalog/order volume grows a lot, this could move to a proper
 * SQL aggregate query instead.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [orders, products] = await Promise.all([getAllOrdersAdmin(), getAllProductsAdmin()]);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const ordersByStatus: Record<OrderStatus, number> = {
    Processing: 0,
    "Out for Delivery": 0,
    Delivered: 0,
    Cancelled: 0,
  };
  for (const order of orders) {
    ordersByStatus[order.status] += 1;
  }

  const activeProducts = products.filter((p) => p.isActive);
  const lowStockProducts = activeProducts
    .filter((p) => p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stockQuantity - b.stockQuantity);
  const outOfStockCount = activeProducts.filter((p) => p.stockQuantity === 0).length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    ordersByStatus,
    recentOrders: orders.slice(0, 5), // already sorted most-recent-first by getAllOrdersAdmin
    lowStockProducts,
    outOfStockCount,
  };
}