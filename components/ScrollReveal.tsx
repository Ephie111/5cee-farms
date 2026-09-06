"use client";

import { useEffect, useRef, useState } from "react";

export type RevealVariant = "fade" | "tilt" | "slide-left" | "slide-right" | "zoom" | "drop-bounce";

function getTransform(variant: RevealVariant, visible: boolean, scaleFrom?: number): string {
  switch (variant) {
    case "tilt":
      // A card tilting up into place, like it's being set down on a
      // table — more dramatic than a flat fade for icon/badge cards.
      return visible
        ? "perspective(900px) rotateX(0deg) translateY(0)"
        : "perspective(900px) rotateX(22deg) translateY(28px)";
    case "slide-left":
      return visible ? "translateX(0)" : "translateX(-70px)";
    case "slide-right":
      return visible ? "translateX(0)" : "translateX(70px)";
    case "zoom":
      return visible ? "scale(1) translateY(0)" : `scale(${scaleFrom ?? 0.9}) translateY(24px)`;
    case "drop-bounce":
      // Falls from above and settles — the transition itself can't do a
      // true multi-step bounce (only two states: hidden/visible), so the
      // "bounce on landing" comes from the bouncier cubic-bezier easing
      // applied below, which overshoots past 0 before settling.
      return visible ? "translateY(0)" : "translateY(-110px)";
    default:
      return visible ? "translateY(0)" : "translateY(1.5rem)";
  }
}

const TRANSITION_TIMING: Partial<Record<RevealVariant, string>> = {
  "drop-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)", // overshoot/bounce landing
};

export default function ScrollReveal({
  children,
  delayMs = 0,
  className = "",
  scaleFrom,
  variant = "fade",
}: {
  children: React.ReactNode;
  /** Stagger delay in milliseconds — use increasing values for a row of cards. */
  delayMs?: number;
  className?: string;
  /** Optional starting scale (e.g. 0.92) — used by the "zoom" variant, or on its own for a subtle zoom-in with the default fade. */
  scaleFrom?: number;
  /**
   * Which entrance style to use:
   * - "fade" (default): the plain fade + slide-up used everywhere so far
   * - "tilt": a 3D perspective tilt-in — dramatic, best for icon/badge/card grids
   * - "slide-left" / "slide-right": slides in from a side — good for paired content (e.g. Mission vs Vision)
   * - "zoom": scales up while fading in — good for photos and feature cards
   * - "drop-bounce": falls from above and bounces on landing — dramatic, best for a staggered row/grid of cards
   */
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // only animate in once, not every scroll pass
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const isPlainFade = variant === "fade" && !scaleFrom;
  const easing = TRANSITION_TIMING[variant] ?? "cubic-bezier(0.16,1,0.3,1)";
  const durationMs = variant === "drop-bounce" ? 900 : 700;

  return (
    <div
      ref={ref}
      className={`transition-all ${
        isPlainFade ? (visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0") : visible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: easing,
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transform: isPlainFade ? undefined : getTransform(variant, visible, scaleFrom),
      }}
    >
      {children}
    </div>
  );
}