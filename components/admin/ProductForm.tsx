"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product, ProductInput, slugify, uploadProductImage } from "@/lib/products";

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
  imageUrl: string | null;
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
    imageUrl: product.imageUrl,
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
  imageUrl: null,
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    // A product needs an id before it has anywhere to upload the image
    // to — for a brand-new product, make sure the name (and therefore
    // the auto-filled id) is entered first.
    if (!values.id.trim()) {
      setError("Enter a product name first, so the image has an id to upload under.");
      return;
    }

    setError(null);
    setUploadingImage(true);
    try {
      const url = await uploadProductImage(values.id.trim(), file);
      set("imageUrl", url);
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
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
        imageUrl: values.imageUrl,
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

        <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Product Photo</span>
          <div className="flex items-center gap-4">
            <div className="img-placeholder relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              {values.imageUrl ? (
                <Image src={values.imageUrl} alt="" fill sizes="96px" className="object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
                </svg>
              )}
            </div>
            <div>
              <label className="inline-flex cursor-pointer items-center rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest hover:bg-forest/5">
                {uploadingImage ? "Uploading…" : values.imageUrl ? "Replace Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {values.imageUrl && (
                <button
                  type="button"
                  onClick={() => set("imageUrl", null)}
                  className="ml-2 text-xs font-medium text-charcoal/50 hover:text-red-600"
                >
                  Remove
                </button>
              )}
              <p className="mt-1 text-[11px] text-charcoal/40">JPG or PNG, up to 5MB.</p>
            </div>
          </div>
        </div>

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