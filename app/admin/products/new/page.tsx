"use client";

import ProductForm from "@/components/admin/ProductForm";
import { createProduct, ProductInput } from "@/lib/products";

export default function NewProductPage() {
  async function handleSubmit(id: string, input: Omit<ProductInput, "id">) {
    await createProduct({ id, ...input });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Add Product</h1>
      <p className="mt-1 text-sm text-charcoal/60">Add a new item to the catalog.</p>
      <div className="mt-6">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}