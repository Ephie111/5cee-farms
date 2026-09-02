import { supabase } from "./supabase";
import type { CartLine } from "./cart-context";

export type OrderStatus = "Processing" | "Out for Delivery" | "Delivered" | "Cancelled";
export type PaymentMethod = "card" | "transfer" | "ussd" | "pod";
export type PaymentStatus = "pending" | "paid" | "failed";

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  deliveryDate: string | null;
  deliverySlot: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paystackReference: string | null;
  status: OrderStatus;
  createdAt: string;
};

type OrderRow = {
  id: string;
  order_number: string;
  user_id: string;
  items: CartLine[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  full_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  delivery_date: string | null;
  delivery_slot: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  paystack_reference: string | null;
  status: OrderStatus;
  created_at: string;
};

function mapRow(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    items: row.items,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    city: row.city,
    state: row.state,
    deliveryDate: row.delivery_date,
    deliverySlot: row.delivery_slot,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paystackReference: row.paystack_reference,
    status: row.status,
    createdAt: row.created_at,
  };
}

export type CreateOrderInput = {
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  paymentMethod: PaymentMethod;
  /** "paid" for a Paystack-verified payment, "pending" for Pay on Delivery. Defaults to "pending". */
  paymentStatus?: PaymentStatus;
  paystackReference?: string;
};

/** Creates a real order row, tied to whoever is currently logged in.
 *  Also atomically deducts stock for every item — see
 *  supabase/stock_deduction_migration.sql for why this has to happen
 *  as a single database transaction rather than separate steps here. */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("You must be logged in to place an order.");
  }

  const { data, error } = await supabase.rpc("create_order_with_stock_check", {
    p_user_id: userData.user.id,
    p_items: input.items,
    p_subtotal: input.subtotal,
    p_delivery_fee: input.deliveryFee,
    p_full_name: input.fullName,
    p_phone: input.phone,
    p_email: input.email ?? null,
    p_address: input.address,
    p_city: input.city,
    p_state: input.state ?? "Anambra",
    p_delivery_date: input.deliveryDate ?? null,
    p_delivery_slot: input.deliverySlot ?? null,
    p_payment_method: input.paymentMethod,
    p_payment_status: input.paymentStatus ?? "pending",
    p_paystack_reference: input.paystackReference ?? null,
  });

  if (error) {
    console.error("createOrder error:", error.message);
    if (error.message.includes("insufficient_stock")) {
      const itemName = error.message.split(":")[1]?.trim();
      throw new Error(
        itemName
          ? `Sorry, "${itemName}" no longer has enough stock for this order. Please update your cart and try again.`
          : "Sorry, one of the items in your cart is no longer available in the requested quantity."
      );
    }
    throw new Error("Failed to create order.");
  }

  const order = Array.isArray(data) ? data[0] : data;
  if (!order) {
    throw new Error("Failed to create order.");
  }

  return mapRow(order as OrderRow);
}

/** All orders for the currently logged-in customer, most recent first. */
export async function getOrdersForUser(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrdersForUser error:", error.message);
    return [];
  }
  return (data as OrderRow[]).map(mapRow);
}

/** A single order by its friendly order number (e.g. "ORD-10234"). */
export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error || !data) return undefined;
  return mapRow(data as OrderRow);
}

// ---------------------------------------------------------------------
// Admin-only functions below. These rely entirely on the database's own
// security rules (the "Admins can view/update all orders" RLS policies
// in supabase/admin_schema.sql) — if a non-admin calls these, Supabase
// simply returns no rows / rejects the update. The app doesn't need to
// re-check "is this really an admin?" here; the database already will.
// ---------------------------------------------------------------------

/** Every order in the store, most recent first. Admins only (enforced by RLS). */
export async function getAllOrdersAdmin(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllOrdersAdmin error:", error.message);
    return [];
  }
  return (data as OrderRow[]).map(mapRow);
}

/** Updates an order's fulfillment status. Admins only (enforced by RLS). */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("order_number")
    .single();

  if (error) {
    console.error("updateOrderStatus error:", error.message);
    throw new Error(error.message);
  }

  // Fire the notification email, but never let a failure here undo or
  // block the status change itself — the update already succeeded.
  if (data?.order_number) {
    fetch("/api/send-order-status-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber: data.order_number, status }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!result.sent) {
          // Visible in the browser console (F12 → Console) — this is a
          // rejected/failed send, not a network error, so it wouldn't
          // otherwise show up anywhere.
          console.warn("Order status email was not sent:", result.error);
        }
      })
      .catch((err) => console.error("Order status email request failed:", err));
  }
}

/** Every order placed by one specific customer, most recent first. Admins only (enforced by RLS). */
export async function getOrdersForCustomerAdmin(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrdersForCustomerAdmin error:", error.message);
    return [];
  }
  return (data as OrderRow[]).map(mapRow);
}