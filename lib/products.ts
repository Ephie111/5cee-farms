// Product data lives in Supabase (table: "products").
// These functions replace the old hardcoded array — same shape the
// rest of the app already expects, just fetched from the database.

import { supabase } from "./supabase";

export type Product = {
  id: string;
  name: string;
  category: "Whole Chicken" | "Chicken Cuts" | "Live Birds" | "Offal";
  price: number; // NGN
  unit: string; // "per bird" | "per pack" | "per carton"
  weightOptions: string[];
  rating: number; // 0-5
  reviewCount: number;
  description: string;
  freshness: string[];
  stockQuantity: number;
  isFeatured?: boolean;
  isActive: boolean;
};

// Supabase stores columns in snake_case; this converts each row to the
// camelCase shape every component in the app already uses.
type ProductRow = {
  id: string;
  name: string;
  category: Product["category"];
  price: number;
  unit: string;
  weight_options: string[];
  rating: number;
  review_count: number;
  description: string;
  freshness: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    unit: row.unit,
    weightOptions: row.weight_options,
    rating: row.rating,
    reviewCount: row.review_count,
    description: row.description,
    freshness: row.freshness,
    stockQuantity: row.stock_quantity,
    isFeatured: row.is_featured,
    isActive: row.is_active,
  };
}

/** Fetch every active product. */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("getAllProducts error:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}

/** Fetch a single product by its id (e.g. "whole-chicken-fresh"). */
export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) return undefined;
  return mapRow(data as ProductRow);
}

/** Products flagged is_featured — shown on the homepage. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("name");

  if (error) {
    console.error("getFeaturedProducts error:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}

/** Other products in the same category — shown on the product detail page. */
export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(count);

  if (error) {
    console.error("getRelatedProducts error:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

// ---------------------------------------------------------------------
// Admin-only functions below. Relies on the "Admins can insert/update/
// view all products" RLS policies (supabase/admin_schema.sql and
// admin_products_select_migration.sql) — a non-admin calling these
// simply gets rejected by the database itself.
// ---------------------------------------------------------------------

/** Every product, active or not. Admins only (enforced by RLS). */
/**
 * Checks whether the requested quantities are actually available right
 * now, for a list of { productId, quantity } — used at Checkout right
 * before charging a card, so a customer isn't charged for something
 * that ran out since they added it to their cart. This is a courtesy
 * pre-check, not the real safeguard — the actual, race-condition-proof
 * stock deduction happens atomically in createOrder() itself.
 */
export async function checkStockAvailability(
  items: { productId: string; quantity: number; name: string }[]
): Promise<{ available: boolean; unavailableItem?: string }> {
  const ids = items.map((i) => i.productId);
  const { data, error } = await supabase
    .from("products")
    .select("id, stock_quantity")
    .in("id", ids);

  if (error || !data) {
    // If the check itself fails, don't block checkout on it — the
    // atomic check in createOrder() is the real safeguard regardless.
    return { available: true };
  }

  const stockById = new Map(data.map((row) => [row.id, row.stock_quantity as number]));

  for (const item of items) {
    const stock = stockById.get(item.productId) ?? 0;
    if (stock < item.quantity) {
      return { available: false, unavailableItem: item.name };
    }
  }

  return { available: true };
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("name");

  if (error) {
    console.error("getAllProductsAdmin error:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(mapRow);
}

/** A single product by id, regardless of active status. Admins only. */
export async function getProductByIdAdmin(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapRow(data as ProductRow);
}

export type ProductInput = {
  id: string;
  name: string;
  category: Product["category"];
  price: number;
  unit: string;
  weightOptions: string[];
  description: string;
  freshness: string[];
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
};

/** Turns a product name into a URL-safe id, e.g. "Chicken Wings" → "chicken-wings". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Creates a new product. Admins only (enforced by RLS). */
export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      id: input.id,
      name: input.name,
      category: input.category,
      price: input.price,
      unit: input.unit,
      weight_options: input.weightOptions,
      description: input.description,
      freshness: input.freshness,
      stock_quantity: input.stockQuantity,
      is_featured: input.isFeatured,
      is_active: input.isActive,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createProduct error:", error?.message);
    throw new Error(error?.message ?? "Failed to create product.");
  }
  return mapRow(data as ProductRow);
}

/** Updates an existing product's details. Admins only (enforced by RLS). */
export async function updateProduct(id: string, input: Omit<ProductInput, "id">): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name,
      category: input.category,
      price: input.price,
      unit: input.unit,
      weight_options: input.weightOptions,
      description: input.description,
      freshness: input.freshness,
      stock_quantity: input.stockQuantity,
      is_featured: input.isFeatured,
      is_active: input.isActive,
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("updateProduct error:", error?.message);
    throw new Error(error?.message ?? "Failed to update product.");
  }
  return mapRow(data as ProductRow);
}

/**
 * Soft-deletes (or restores) a product by flipping is_active, instead
 * of actually deleting the row. Past orders store a snapshot of what
 * was purchased, but a real DELETE would still be best avoided in case
 * anything else ever comes to reference a product by id.
 */
export async function setProductActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id);
  if (error) {
    console.error("setProductActive error:", error.message);
    throw new Error(error.message);
  }
}