"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

// Routes under /admin/* that must NOT be gated — reachable by someone
// who isn't logged in as an admin at all yet (or ever, in the login
// page's case).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/accept-invite"];

const ADMIN_TIER_ROLES = ["admin", "super_admin"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, status, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

  // "checking" | "ok" | "blocked" — result of a FRESH, un-cached check
  // against the database on every single admin page visit. This is
  // deliberately separate from the cached role/status in AuthContext,
  // because that context only refreshes on sign-in/sign-out — without
  // this, someone suspended mid-session would keep their old cached
  // "active" state until they happened to log out and back in.
  const [freshCheck, setFreshCheck] = useState<"checking" | "ok" | "blocked">("checking");

  useEffect(() => {
    if (isPublicPath) return;
    if (loading) return;

    if (!user) {
      router.push("/admin/login");
      return;
    }

    let cancelled = false;
    setFreshCheck("checking");

    supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single()
      .then(async ({ data }) => {
        if (cancelled) return;

        const isAdminTier = data?.role && ADMIN_TIER_ROLES.includes(data.role);
        const isActive = data?.status === "active";

        if (!isAdminTier || !isActive) {
          // Deliberately vague — doesn't confirm or deny why access was
          // refused to someone probing the admin panel.
          await supabase.auth.signOut();
          router.push("/admin/login");
          setFreshCheck("blocked");
          return;
        }

        // Extra gate: Manage Admins (and everything under it) is
        // Super Admin only, per the requirement that only Super Admins
        // can create/manage/deactivate other admin accounts.
        if ((pathname.startsWith("/admin/team") || pathname.startsWith("/admin/activity")) && data.role !== "super_admin") {
          router.push("/admin");
          setFreshCheck("blocked");
          return;
        }

        setFreshCheck("ok");
      });

    return () => {
      cancelled = true;
    };
    // Re-runs on every navigation within /admin/*, not just on mount —
    // this is what catches "revoked while I was already in here".
  }, [isPublicPath, loading, user, pathname, router]);

  if (isPublicPath) return <>{children}</>;

  if (loading || !user || freshCheck !== "ok") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream text-sm text-charcoal/50">
        {freshCheck === "blocked" ? "Redirecting…" : "Checking access…"}
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
          <AdminSidebar isSuperAdmin={role === "super_admin"} />
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}