import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-soil text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <p className="font-display text-lg font-bold">5CEE FARMS LTD</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/60">
              Chiso Foods
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Fresh. Clean. Trusted. Nourishing communities, one farm at a
              time.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Shop
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link href="/shop" className="hover:text-gold">All Products</Link></li>
              <li><Link href="/cart" className="hover:text-gold">Cart</Link></li>
              <li><Link href="/checkout" className="hover:text-gold">Checkout</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Company
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link href="/#about" className="hover:text-gold">About Us</Link></li>
              <li><Link href="/#team" className="hover:text-gold">Our Team</Link></li>
              <li><Link href="/policies" className="hover:text-gold">Return &amp; Delivery Policy</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>NKPAGU Farmland, Obodo Adaka, Ifite Awka</li>
              <li>Awka South LGA, Anambra State</li>
              <li>
                <a href="tel:+2347061302674" className="hover:text-gold">
                  0706 130 2674
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} 5CEE Farms Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/policies" className="hover:text-gold">Return &amp; Refund Policy</Link>
            <Link href="/policies#delivery" className="hover:text-gold">Delivery Policy</Link>
            <Link href="/terms" className="hover:text-gold">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-gold">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}