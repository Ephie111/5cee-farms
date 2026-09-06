export default function GradientBorderCard({
  children,
  className = "",
  innerClassName = "bg-white",
  href,
  target,
}: {
  children: React.ReactNode;
  /** Extra classes for the outer (gradient) wrapper — e.g. "h-full" to stretch in a flex/grid row. */
  className?: string;
  /** Classes for the inner card surface — override the background here for dark cards (e.g. "bg-forest text-white"). */
  innerClassName?: string;
  /** When provided, the whole card renders as a link — the border, lift, and glow all move together with the click target. */
  href?: string;
  target?: string;
}) {
  const outerClasses = `group block rounded-2xl bg-gradient-to-br from-gold via-leaf to-forest p-[2.5px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gold/30 ${className}`;
  const inner = <div className={`h-full w-full rounded-2xl ${innerClassName}`}>{children}</div>;

  if (href) {
    return (
      <a href={href} target={target} rel={target === "_blank" ? "noreferrer" : undefined} className={outerClasses}>
        {inner}
      </a>
    );
  }

  return <div className={outerClasses}>{inner}</div>;
}