"use client";

export type DeliveryDetails = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  deliveryDate: string;
  deliverySlot: string;
};

export const TIME_SLOTS = ["9:00 AM – 12:00 PM", "12:00 PM – 3:00 PM", "3:00 PM – 6:00 PM"];

export default function DeliveryForm({
  value,
  onChange,
}: {
  value: DeliveryDetails;
  onChange: (next: DeliveryDetails) => void;
}) {
  function set<K extends keyof DeliveryDetails>(key: K, val: DeliveryDetails[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-6">
      <h2 className="font-display text-base font-bold text-forest">Delivery Details</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Full Name</span>
          <input
            type="text"
            placeholder="e.g. Ngozi Adaeze"
            value={value.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Phone Number</span>
          <input
            type="tel"
            placeholder="0706 130 2674"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Email (optional)</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-charcoal/80">Delivery Address</span>
          <input
            type="text"
            placeholder="Street, house number, landmark"
            value={value.address}
            onChange={(e) => set("address", e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">City / Town</span>
          <select
            value={value.city}
            onChange={(e) => set("city", e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          >
            <option>Awka</option>
            <option>Onitsha</option>
            <option>Nnewi</option>
            <option>Other (Southeast)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">State</span>
          <select
            value={value.state}
            onChange={(e) => set("state", e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          >
            <option>Anambra</option>
            <option>Enugu</option>
            <option>Imo</option>
            <option>Abia</option>
            <option>Delta</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Delivery Date</span>
          <input
            type="date"
            value={value.deliveryDate}
            onChange={(e) => set("deliveryDate", e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Delivery Time Slot</span>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => (
              <label
                key={slot}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-forest/20 px-3 py-1.5 text-xs font-medium has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="time-slot"
                  checked={value.deliverySlot === slot}
                  onChange={() => set("deliverySlot", slot)}
                  className="hidden"
                />
                {slot}
              </label>
            ))}
          </div>
        </div>
      </div>

      <label className="mt-5 flex items-start gap-2 text-xs text-charcoal/60">
        <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest" />
        Same-day delivery may be limited for bulk orders — see our{" "}
        <a href="/policies#delivery" className="text-forest underline">Delivery Policy</a>.
      </label>
    </div>
  );
}