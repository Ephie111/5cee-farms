export default function AuthInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-charcoal/80">{label}</span>
      <input
        {...props}
        className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
      />
    </label>
  );
}