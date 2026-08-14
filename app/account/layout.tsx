"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/lib/auth-context";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until we actually know whether someone's logged in before
    // deciding to redirect — otherwise this fires on every page load
    // for a split second while the session is still being checked.
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-24 text-center text-sm text-charcoal/50">
          {loading ? "Loading your account…" : "Redirecting to login…"}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row">
          <AccountSidebar />
          <div className="flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}