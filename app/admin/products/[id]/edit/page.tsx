"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductByIdAdmin, updateProduct, Product, ProductInput } from "@/lib/products";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    getProductByIdAdmin(params.id).then((found) => setProduct(found ?? null));
  }, [params.id]);

  async function handleSubmit(id: string, input: Omit<ProductInput, "id">) {
    await updateProduct(id, input);
  }

  if (product === undefined) {
    return <p className="text-sm text-charcoal/50">Loading product…</p>;
  }

  if (product === null) {
    return <p className="text-sm text-charcoal/50">Product not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Edit Product</h1>
      <p className="mt-1 text-sm text-charcoal/60">{product.name}</p>
      <div className="mt-6">
        <ProductForm existingProduct={product} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}