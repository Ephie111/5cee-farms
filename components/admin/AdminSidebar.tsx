"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

// More links (Dashboard, Products, Customers, etc.) get added here as
// those admin pages are built.
const LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Products", href: "/admin/products" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Manage Admins", href: "/admin/team" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-forest/10 bg-white p-2 lg:flex-col lg:gap-1 lg:overflow-visible">
        {LINKS.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
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