"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/#about" },
  { label: "Our Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const { user, role, loading } = useAuth();
  const { items } = useCart();
  const cartItemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0];

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo — replace /public/images/logo.png with the real 5CEE Farms logo */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="5CEE Farms Ltd logo"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-bold text-forest">
              5CEE FARMS <span className="text-gold-dark">LTD</span>
            </p>
            <p className="text-[11px] tracking-widest text-soil uppercase">
              Chiso Foods
            </p>
          </div>
        </Link>

        {/* Desktop nav — unchanged, hidden below md */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal hover:text-forest"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5"
            aria-label="View cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.907-4.75 2.311-7.303a.996.996 0 00-.998-1.147H5.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
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

          {/* Hamburger — mobile only. This is what was missing: everything
              above collapses away below the sm/md breakpoints with nowhere
              else for a mobile visitor to reach it, so this button opens
              a dedicated mobile menu panel that holds all of it. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5 md:hidden"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-forest/10 bg-cream md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-forest/5 py-3 text-sm font-medium text-charcoal hover:text-forest"
              >
                {link.label}
              </a>
            ))}

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
      )}
    </header>
  );
}