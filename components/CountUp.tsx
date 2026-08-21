"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({
  target,
  durationMs = 1200,
  className = "",
}: {
  /** The number to count up to, e.g. 2020 */
  target: number;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = performance.now();

          function tick(now: number) {
            const progress = Math.min((now - start) / durationMs, 1);
            // ease-out cubic — fast start, gentle landing on the final number
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}