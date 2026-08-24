"use client";

const CATEGORIES = ["Whole Chicken", "Chicken Cuts", "Live Birds", "Offal"] as const;
const WEIGHT_BANDS = ["Under 1kg", "1kg – 2kg", "Over 2kg"] as const;

export type ShopFilterState = {
  categories: string[];
  weightBands: string[];
  maxPrice: number;
};

export default function ShopFilters({
  filters,
  onChange,
  onReset,
  maxPossiblePrice,
}: {
  filters: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
  onReset: () => void;
  /** The highest price among currently loaded products — the slider can
   *  never go higher than this, so it stays accurate as products are
   *  added/priced over time instead of a hardcoded ceiling. */
  maxPossiblePrice: number;
}) {
  function toggleCategory(cat: string) {
    const exists = filters.categories.includes(cat);
    onChange({
      ...filters,
      categories: exists
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    });
  }

  function toggleWeight(band: string) {
    const exists = filters.weightBands.includes(band);
    onChange({
      ...filters,
      weightBands: exists
        ? filters.weightBands.filter((w) => w !== band)
        : [...filters.weightBands, band],
    });
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-forest/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-forest">Filters</h3>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-gold-dark hover:underline"
          >
            Reset
          </button>
        </div>

        {/* Category */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Category
          </p>
          <div className="mt-3 space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Weight */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Weight
          </p>
          <div className="mt-3 space-y-2">
            {WEIGHT_BANDS.map((band) => (
              <label key={band} className="flex items-center gap-2 text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={filters.weightBands.includes(band)}
                  onChange={() => toggleWeight(band)}
                  className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest"
                />
                {band}
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Max Price: <span className="text-forest">₦{filters.maxPrice.toLocaleString("en-NG")}</span>
          </p>
          <input
            type="range"
            min={Math.min(2000, maxPossiblePrice)}
            max={maxPossiblePrice}
            step={500}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="mt-3 w-full accent-forest"
          />
          <div className="mt-1 flex justify-between text-[11px] text-charcoal/50">
            <span>₦{Math.min(2000, maxPossiblePrice).toLocaleString("en-NG")}</span>
            <span>₦{maxPossiblePrice.toLocaleString("en-NG")}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}