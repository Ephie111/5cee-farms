"use client";

import { useState } from "react";

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Card Payment",
    description: "Visa, Mastercard, Verve — via Paystack",
    icon: "card",
  },
  {
    id: "transfer",
    label: "Bank Transfer",
    description: "Automatic verification via Paystack",
    icon: "bank",
  },
  {
    id: "ussd",
    label: "USSD",
    description: "Pay directly from your bank's USSD code",
    icon: "ussd",
  },
  {
    id: "pod",
    label: "Pay on Delivery",
    description: "Pay cash or transfer when your order arrives",
    icon: "cash",
  },
] as const;

function MethodIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    card: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-9-4.875v6.75A2.25 2.25 0 004.5 20.25h15a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v5.25z",
    bank: "M3 21h18M4.5 21V9.75m3.75 11.25V9.75m3.75 11.25V9.75m3.75 11.25V9.75m3.75 11.25V9.75M2.25 9.75L12 3l9.75 6.75H2.25z",
    ussd: "M8.25 3.75H15a2.25 2.25 0 012.25 2.25v12A2.25 2.25 0 0115 20.25H9A2.25 2.25 0 016.75 18V6A2.25 2.25 0 019 3.75h-.75zM12 17.25h.008v.008H12v-.008z",
    cash: "M2.25 8.25h19.5A.75.75 0 0122.5 9v9.75a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75V9a.75.75 0 01.75-.75zM2.25 8.25V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v2.25M12 15.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z",
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export default function PaymentMethodSelector({
  value,
  onChange,
}: {
  value?: PaymentMethodId;
  onChange?: (id: PaymentMethodId) => void;
}) {
  const [internalSelected, setInternalSelected] = useState<PaymentMethodId>("card");
  const selected = value ?? internalSelected;

  function handleSelect(id: PaymentMethodId) {
    setInternalSelected(id);
    onChange?.(id);
  }

  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-6">
      <h2 className="font-display text-base font-bold text-forest">Payment Method</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
              selected === method.id ? "border-forest bg-forest/5" : "border-forest/15 hover:border-forest/40"
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              checked={selected === method.id}
              onChange={() => handleSelect(method.id)}
              className="mt-1 h-4 w-4 text-forest focus:ring-forest"
            />
            <span className="text-forest">
              <MethodIcon name={method.icon} />
            </span>
            <span>
              <p className="text-sm font-semibold text-charcoal">{method.label}</p>
              <p className="text-xs text-charcoal/60">{method.description}</p>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}