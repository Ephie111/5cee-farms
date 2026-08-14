"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartLine = {
  id: string; // productId + weight, so the same product at a different weight is a separate line
  productId: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  addItem: (item: Omit<CartLine, "id">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "chiso-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load whatever was in the cart last time this browser visited.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore malformed/blocked storage
    }
    setHydrated(true);
  }, []);

  // Save on every change (but not before the initial load finishes,
  // or we'd overwrite the saved cart with an empty one).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  function addItem(newItem: Omit<CartLine, "id">) {
    const id = `${newItem.productId}::${newItem.weight}`;
    setItems((prev) => {
      const existing = prev.find((line) => line.id === id);
      if (existing) {
        return prev.map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + newItem.quantity } : line
        );
      }
      return [...prev, { ...newItem, id }];
    });
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) => prev.map((line) => (line.id === id ? { ...line, quantity } : line)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((line) => line.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}