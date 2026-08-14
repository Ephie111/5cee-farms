import { supabase } from "./supabase";
import type { CartLine } from "./cart-context";

export type OrderStatus = "Processing" | "Out for Delivery" | "Delivered" | "Cancelled";
export type PaymentMethod = "card" | "transfer" | "ussd" | "pod";
export type PaymentStatus = "pending" | "paid" | "failed";

export type Order = {
  id: string;
  orderNumber: string;
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

/** Creates a real order row, tied to whoever is currently logged in. */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("You must be logged in to place an order.");
  }

  const total = input.subtotal + input.deliveryFee;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: userData.user.id,
      items: input.items,
      subtotal: input.subtotal,
      delivery_fee: input.deliveryFee,
      total,
      full_name: input.fullName,
      phone: input.phone,
      email: input.email ?? null,
      address: input.address,
      city: input.city,
      state: input.state ?? "Anambra",
      delivery_date: input.deliveryDate ?? null,
      delivery_slot: input.deliverySlot ?? null,
      payment_method: input.paymentMethod,
      payment_status: input.paymentStatus ?? "pending",
      paystack_reference: input.paystackReference ?? null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createOrder error:", error?.message);
    throw new Error(error?.message ?? "Failed to create order.");
  }

  return mapRow(data as OrderRow);
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
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) {
    console.error("updateOrderStatus error:", error.message);
    throw new Error(error.message);
  }
}