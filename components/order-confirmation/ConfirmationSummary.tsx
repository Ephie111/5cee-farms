import { formatNaira } from "@/lib/products";

export type ConfirmedLine = {
  id: string;
  name: string;
  weight: string;
  quantity: number;
  price: number;
};

export default function ConfirmationSummary({
  orderNumber,
  items,
  deliveryFee,
  estimatedDelivery,
  paymentStatus,
  paymentMethod,
}: {
  orderNumber: string;
  items: ConfirmedLine[];
  deliveryFee: number;
  estimatedDelivery: string;
  paymentStatus?: "pending" | "paid" | "failed";
  paymentMethod?: string;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const paymentLabel =
    paymentStatus === "paid"
      ? "Paid"
      : paymentMethod === "pod"
        ? "Pay on Delivery"
        : "Payment Pending";
  const paymentStyle =
    paymentStatus === "paid"
      ? "bg-forest/10 text-forest"
      : "bg-gold/15 text-gold-dark";

  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Order Number</p>
            {paymentStatus && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${paymentStyle}`}>
                {paymentLabel}
              </span>
            )}
          </div>
          <p className="font-display text-lg font-bold text-forest">{orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Estimated Delivery</p>
          <p className="text-sm font-semibold text-charcoal">{estimatedDelivery}</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-forest/10">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4">
            <div className="img-placeholder h-14 w-14 shrink-0 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a1.5 1.5 0 001.5-1.5V4.5A1.5 1.5 0 0021 3H3a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 003 21z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-charcoal">{item.name}</p>
              <p className="text-xs text-charcoal/55">{item.weight} · Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-forest">{formatNaira(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <dl className="mt-4 space-y-2 border-t border-forest/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-charcoal/60">Subtotal</dt>
          <dd className="font-medium">{formatNaira(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-charcoal/60">Delivery Fee</dt>
          <dd className="font-medium">{formatNaira(deliveryFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-forest/10 pt-2">
          <dt className="font-display font-bold text-charcoal">Total Paid</dt>
          <dd className="font-display text-base font-extrabold text-forest">{formatNaira(total)}</dd>
        </div>
      </dl>
    </div>
  );
}