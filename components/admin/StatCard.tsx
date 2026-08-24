export default function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "gold" | "warning" | "blue";
}) {
  const valueStyle =
    tone === "gold"
      ? "text-gold-dark"
      : tone === "warning"
        ? "text-red-600"
        : tone === "blue"
          ? "text-blue-600"
          : "text-forest";

  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-extrabold ${valueStyle}`}>{value}</p>
    </div>
  );
}