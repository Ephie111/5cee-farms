import { supabase } from "./supabase";
import { getAllOrdersAdmin, Order } from "./orders";

export type CustomerSummary = {
  id: string;
  fullName: string | null;
  email: string | null;
  joinedAt: string;
  orderCount: number;
  totalSpent: number; // sum of paid orders only
  lastOrderDate: string | null;
  /** Best-known phone number, taken from their most recent order — profiles
   *  itself doesn't store phone (that lives in auth user_metadata, which
   *  isn't readable from the client), so this is a practical stand-in. */
  phone: string | null;
};

/**
 * Every registered customer, with their order stats attached. Combines
 * the "profiles" table (admins can view all, per admin_schema.sql) with
 * the existing admin order list — no new database table needed.
 */
export async function getAllCustomersAdmin(): Promise<CustomerSummary[]> {
  const [{ data: profiles, error: profilesError }, orders] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false }),
    getAllOrdersAdmin(),
  ]);

  if (profilesError) {
    console.error("getAllCustomersAdmin error:", profilesError.message);
    return [];
  }

  const ordersByCustomer = new Map<string, Order[]>();
  for (const order of orders) {
    const existing = ordersByCustomer.get(order.userId) ?? [];
    existing.push(order);
    ordersByCustomer.set(order.userId, existing);
  }

  return profiles.map((profile) => {
    const customerOrders = ordersByCustomer.get(profile.id) ?? [];
    const totalSpent = customerOrders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      joinedAt: profile.created_at,
      orderCount: customerOrders.length,
      totalSpent,
      lastOrderDate: customerOrders[0]?.createdAt ?? null, // already sorted most-recent-first
      phone: customerOrders[0]?.phone ?? null,
    };
  });
}

/** One customer's basic profile info, for the customer detail page header. */
export async function getCustomerByIdAdmin(id: string): Promise<{ id: string; fullName: string | null; email: string | null; joinedAt: string } | undefined> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return { id: data.id, fullName: data.full_name, email: data.email, joinedAt: data.created_at };
}