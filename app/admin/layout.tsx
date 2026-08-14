"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage || loading) return;

    if (!user) {
      router.push("/admin/login");
      return;
    }
    if (role !== "admin") {
      // Logged in, but NOT an admin — deliberately vague message here
      // (doesn't confirm or deny whether the admin panel even exists
      // to someone who shouldn't be probing it).
      router.push("/");
    }
  }, [isLoginPage, loading, user, role, router]);

  // The login page renders itself with its own full-page layout — no
  // sidebar/guard wrapper needed there.
  if (isLoginPage) return <>{children}</>;

  if (loading || !user || role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream text-sm text-charcoal/50">
        {loading ? "Checking access…" : "Redirecting…"}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-forest/10 bg-white px-6 py-4 lg:px-10">
        <p className="font-display text-sm font-bold text-forest">5CEE FARMS — Admin Panel</p>
      </div>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <AdminSidebar />
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}