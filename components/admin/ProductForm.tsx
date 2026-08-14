"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductInput, slugify } from "@/lib/products";

const CATEGORIES: Product["category"][] = ["Whole Chicken", "Chicken Cuts", "Live Birds", "Offal"];

export type ProductFormValues = {
  id: string;
  name: string;
  category: Product["category"];
  price: string;
  unit: string;
  weightOptions: string; // comma-separated in the form, split into an array on submit
  description: string;
  freshness: string; // one per line in the form, split into an array on submit
  stockQuantity: string;
  isFeatured: boolean;
  isActive: boolean;
};

function toFormValues(product: Product): ProductFormValues {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: String(product.price),
    unit: product.unit,
    weightOptions: product.weightOptions.join(", "),
    description: product.description,
    freshness: product.freshness.join("\n"),
    stockQuantity: String(product.stockQuantity),
    isFeatured: product.isFeatured ?? false,
    isActive: product.isActive,
  };
}

const EMPTY_VALUES: ProductFormValues = {
  id: "",
  name: "",
  category: "Whole Chicken",
  price: "",
  unit: "per bird",
  weightOptions: "",
  description: "",
  freshness: "",
  stockQuantity: "0",
  isFeatured: false,
  isActive: true,
};

export default function ProductForm({
  existingProduct,
  onSubmit,
}: {
  /** Pass an existing Product when editing; omit for a new product. */
  existingProduct?: Product;
  onSubmit: (id: string, input: Omit<ProductInput, "id">) => Promise<void>;
}) {
  const router = useRouter();
  const isEditing = !!existingProduct;

  const [values, setValues] = useState<ProductFormValues>(
    existingProduct ? toFormValues(existingProduct) : EMPTY_VALUES
  );
  const [idManuallyEdited, setIdManuallyEdited] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleNameChange(name: string) {
    set("name", name);
    // Auto-fill the id from the name until the admin edits the id
    // themselves — after that, respect whatever they typed.
    if (!idManuallyEdited) {
      set("id", slugify(name));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const price = Number(values.price);
    const stockQuantity = Number(values.stockQuantity);

    if (!values.name.trim() || !values.id.trim()) {
      setError("Name and product ID are required.");
      return;
    }
    if (Number.isNaN(price) || price <= 0) {
      setError("Enter a valid price.");
      return;
    }
    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }
    const weightOptions = values.weightOptions.split(",").map((w) => w.trim()).filter(Boolean);
    if (weightOptions.length === 0) {
      setError("Add at least one weight/size option, separated by commas.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(values.id.trim(), {
        name: values.name.trim(),
        category: values.category,
        price,
        unit: values.unit.trim() || "per unit",
        weightOptions,
        description: values.description.trim(),
        freshness: values.freshness.split("\n").map((f) => f.trim()).filter(Boolean),
        stockQuantity,
        isFeatured: values.isFeatured,
        isActive: values.isActive,
      });
      router.push("/admin/products");
    } catch (err) {
      console.error("Product save error:", err);
      setError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-forest/10 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Product Name</span>
          <input
            type="text"
            value={values.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">
            Product ID <span className="font-normal text-charcoal/40">(used in the product URL — auto-filled from the name)</span>
          </span>
          <input
            type="text"
            value={values.id}
            disabled={isEditing}
            onChange={(e) => {
              setIdManuallyEdited(true);
              set("id", slugify(e.target.value));
            }}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 font-mono text-xs focus:border-forest focus:outline-none disabled:bg-forest/5 disabled:text-charcoal/50"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Category</span>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value as Product["category"])}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Unit</span>
          <input
            type="text"
            placeholder="per bird / per pack / per carton"
            value={values.unit}
            onChange={(e) => set("unit", e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Price (₦)</span>
          <input
            type="number"
            min="0"
            step="50"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Stock Quantity</span>
          <input
            type="number"
            min="0"
            value={values.stockQuantity}
            onChange={(e) => set("stockQuantity", e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">
            Weight / Size Options <span className="font-normal text-charcoal/40">(comma-separated, e.g. "1kg, 1.5kg, 2kg")</span>
          </span>
          <input
            type="text"
            value={values.weightOptions}
            onChange={(e) => set("weightOptions", e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Description</span>
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">
            Freshness / Handling Info <span className="font-normal text-charcoal/40">(one point per line)</span>
          </span>
          <textarea
            value={values.freshness}
            onChange={(e) => set("freshness", e.target.value)}
            rows={4}
            placeholder={"100% natural, no additives\nKeep refrigerated\nCook thoroughly before consumption"}
            className="rounded-lg border border-forest/20 px-3 py-2.5 font-mono text-xs focus:border-forest focus:outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(e) => set("isFeatured", e.target.checked)}
            className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest"
          />
          Show on Homepage (Featured)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest"
          />
          Active (visible in Shop)
        </label>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-forest/20 px-6 py-3 text-sm font-semibold text-charcoal/60 hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}