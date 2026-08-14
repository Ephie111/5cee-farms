"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { label: "Profile", href: "/account" },
  { label: "Order History", href: "/account/orders" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-forest/10 bg-white p-2 lg:flex-col lg:gap-1 lg:overflow-visible">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-forest text-white"
                  : "text-charcoal/70 hover:bg-forest/5 hover:text-forest"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleSignOut}
          className="whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium text-charcoal/50 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          Log Out
        </button>
      </nav>
    </aside>
  );
}