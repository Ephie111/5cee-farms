import type { ReactNode } from "react";

export function PolicyH2({ children }: { children: ReactNode }) {
  return <h3 className="mt-10 text-xl font-bold text-forest first:mt-0">{children}</h3>;
}

export function PolicyP({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{children}</p>;
}

export function PolicyList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-charcoal/80">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}