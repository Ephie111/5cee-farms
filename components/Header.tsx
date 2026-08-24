"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/#team" },
  { label: "Blog", href: "/blog" },
  { label: "Shop", href: "/shop" },
  { label: "Bulk Orders", href: "/bulk-orders" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const { user, role, loading } = useAuth();
  const { items } = useCart();
  const cartItemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0];
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Cart bounce — briefly animate the cart icon whenever the item
  // count goes UP (not on page load, not when items are removed).
  const [cartBounce, setCartBounce] = useState(false);
  const prevCount = useRef(cartItemCount);
  useEffect(() => {
    if (cartItemCount > prevCount.current) {
      setCartBounce(true);
      const timeout = setTimeout(() => setCartBounce(false), 500);
      prevCount.current = cartItemCount;
      return () => clearTimeout(timeout);
    }
    prevCount.current = cartItemCount;
  }, [cartItemCount]);

  function isActive(href: string) {
    if (href.includes("#")) return false; // hash-anchor links (About/Team/Contact) aren't scroll-spied
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Header "activates" — slightly deeper background + a real shadow —
  // once the page has scrolled a bit, instead of always looking the same.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition-all duration-300 ${
        scrolled
          ? "border-forest/15 bg-cream/98 shadow-md"
          : "border-forest/10 bg-cream/95 shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo — subtle scale on hover signals it's clickable */}
        <Link href="/" className="group flex items-center gap-3" onClick={closeMenu}>
          <div className="relative h-20 w-20 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.jpg"
              alt="5CEE Farms Ltd logo"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="font-display text-xl font-bold text-forest">
              5CEE FARMS <span className="text-gold-dark">LTD</span>
            </p>
            <p className="text-xs tracking-widest text-soil uppercase">
              Chiso Foods
            </p>
          </div>
        </Link>

        {/* Desktop nav — underline sweep on hover, persistent underline on active page */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const isHashAnchor = link.href.includes("#");
            const linkClassName = `group relative py-1 text-sm font-medium transition-colors ${
              active ? "text-forest" : "text-charcoal hover:text-forest"
            }`;
            const underline = (
              <span
                className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-gold transition-transform duration-300 ease-out ${
                  active
                    ? "w-full origin-left scale-x-100"
                    : "w-full origin-center scale-x-0 group-hover:scale-x-100"
                }`}
              />
            );
            return isHashAnchor ? (
              <a key={link.href} href={link.href} className={linkClassName}>
                {link.label}
                {underline}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.label}
                {underline}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5"
            aria-label="View cart"
          >
            <span className={cartBounce ? "animate-cart-bounce" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.907-4.75 2.311-7.303a.996.996 0 00-.998-1.147H5.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </span>
            {cartItemCount > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal transition-transform ${
                  cartBounce ? "scale-125" : "scale-100"
                }`}
              >
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Account — shows Login when logged out, links to /account when logged in (desktop only) */}
          {!loading && (
            user ? (
              <Link
                href="/account"
                className="hidden items-center gap-1.5 text-sm font-medium text-charcoal hover:text-forest sm:flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Hi, {firstName ?? "there"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden text-sm font-medium text-charcoal hover:text-forest sm:inline-flex"
              >
                Login
              </Link>
            )
          )}

          {/* Admin Dashboard — only ever visible to accounts with role "admin" (desktop only) */}
          {!loading && role === "admin" && (
            <Link
              href="/admin"
              className="hidden rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold-dark hover:bg-gold/10 sm:inline-flex"
            >
              Admin Dashboard
            </Link>
          )}

          <Link href="/shop" className="btn-primary hidden sm:inline-flex">
            Shop Now
          </Link>

          {/* Hamburger — morphs into an X rather than swapping icons abruptly */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5 md:hidden"
          >
            <span className="relative flex h-5 w-6 flex-col justify-between">
              <span
                className={`h-0.5 w-full rounded-full bg-current transition-transform duration-300 ease-out ${
                  menuOpen ? "translate-y-[9px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full rounded-full bg-current transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-full rounded-full bg-current transition-transform duration-300 ease-out ${
                  menuOpen ? "-translate-y-[9px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu panel — slides/fades in rather than snapping open */}
      <div
        className={`grid overflow-hidden border-forest/10 bg-cream transition-all duration-300 ease-out md:hidden ${
          menuOpen ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] border-t-0 opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              const isHashAnchor = link.href.includes("#");
              const linkClassName = `border-b border-forest/5 py-3 text-sm font-medium ${
                active ? "text-forest font-semibold" : "text-charcoal hover:text-forest"
              }`;
              return isHashAnchor ? (
                <a key={link.href} href={link.href} onClick={closeMenu} className={linkClassName}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} onClick={closeMenu} className={linkClassName}>
                  {link.label}
                </Link>
              );
            })}

            {!loading && (
              user ? (
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="border-b border-forest/5 py-3 text-sm font-medium text-charcoal hover:text-forest"
                >
                  My Account (Hi, {firstName ?? "there"})
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="border-b border-forest/5 py-3 text-sm font-medium text-charcoal hover:text-forest"
                >
                  Login
                </Link>
              )
            )}

            {!loading && role === "admin" && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="border-b border-forest/5 py-3 text-sm font-semibold text-gold-dark"
              >
                Admin Dashboard
              </Link>
            )}

            <Link href="/shop" onClick={closeMenu} className="btn-primary mt-4 justify-center">
              Shop Now
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}