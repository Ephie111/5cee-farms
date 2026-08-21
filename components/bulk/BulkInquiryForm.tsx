"use client";

import { useState } from "react";

const ORDER_TYPES = ["Whole Chicken (Bulk)", "Live Birds (Bulk)", "Mixed / Custom Order"];

export default function BulkInquiryForm() {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState(ORDER_TYPES[0]);
  const [quantity, setQuantity] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!contactName.trim() || !phone.trim() || !quantity.trim()) {
      setError("Please fill in your name, phone number, and estimated quantity.");
      return;
    }
    if (neededBy) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosenDate = new Date(neededBy);
      if (chosenDate < today) {
        setError("The date needed can't be in the past — please choose today or a future date.");
        return;
      }
    }

    // No backend for bulk inquiries yet — this sends the request straight
    // to WhatsApp with everything pre-filled, so it's genuinely usable
    // today rather than a dead-end form.
    const lines = [
      "Bulk/Wholesale Order Inquiry",
      businessName ? `Business: ${businessName}` : null,
      `Contact: ${contactName}`,
      `Phone: ${phone}`,
      `Order Type: ${orderType}`,
      `Estimated Quantity: ${quantity}`,
      neededBy ? `Needed By: ${neededBy}` : null,
      notes ? `Notes: ${notes}` : null,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/2347061302674?text=${message}`, "_blank");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-forest/10 bg-white p-6">
      <h2 className="font-display text-base font-bold text-forest">Request a Quote</h2>
      <p className="text-sm text-charcoal/60">
        Tell us what you need and we&apos;ll get back to you with pricing — this opens WhatsApp with your details pre-filled.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Business / Organization Name (optional)</span>
          <input
            type="text"
            placeholder="e.g. Amara's Kitchen"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Your Name</span>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Phone Number</span>
          <input
            type="tel"
            placeholder="0706 130 2674"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Order Type</span>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          >
            {ORDER_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Estimated Quantity</span>
          <input
            type="text"
            placeholder="e.g. 50 birds"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Needed By (optional)</span>
          <input
            type="date"
            value={neededBy}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setNeededBy(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Additional Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Delivery location, event details, recurring order, etc."
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button type="submit" className="btn-primary w-full">
        Send Inquiry via WhatsApp
      </button>
    </form>
  );
}