"use client";

type PaystackChannel = "card" | "bank" | "ussd" | "bank_transfer";

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number; // in kobo (₦1 = 100 kobo)
  currency?: string;
  channels?: PaystackChannel[];
  callback: (response: { reference: string }) => void;
  onClose: () => void;
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

const PAYSTACK_SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Paystack can only run in the browser."));
      return;
    }
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PAYSTACK_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack.")));
      return;
    }

    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack."));
    document.body.appendChild(script);
  });
}

export type PayWithPaystackInput = {
  email: string;
  amountNaira: number;
  channels?: PaystackChannel[];
};

/**
 * Opens the Paystack popup and resolves with the transaction reference
 * once the customer completes payment. Resolves to `null` if they close
 * the popup without paying — that's a cancellation, not an error.
 */
export async function payWithPaystack(input: PayWithPaystackInput): Promise<string | null> {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("Paystack is not configured (missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY).");
  }

  await loadPaystackScript();

  return new Promise((resolve, reject) => {
    if (!window.PaystackPop) {
      reject(new Error("Paystack failed to load. Check your internet connection and try again."));
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: input.email,
      amount: Math.round(input.amountNaira * 100),
      currency: "NGN",
      channels: input.channels,
      callback: (response) => resolve(response.reference),
      onClose: () => resolve(null),
    });

    handler.openIframe();
  });
}