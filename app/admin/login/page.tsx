"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If someone lands here already logged in as an admin (e.g. a
  // bookmarked /admin/login), skip straight to the Dashboard instead
  // of making them look at a login form again.
  useEffect(() => {
    if (!authLoading && user && role === "admin") {
      router.push("/admin");
    }
  }, [authLoading, user, role, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      console.error("Admin login error:", signInError);
      setLoading(false);
      setError("Incorrect email or password.");
      return;
    }

    // Check the role directly here rather than waiting on AuthContext —
    // avoids a race where we'd redirect before the context finishes
    // loading the role.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signInData.user.id)
      .single();

    setLoading(false);

    if (profile?.role !== "admin") {
      setError("This account doesn't have admin access.");
      await supabase.auth.signOut();
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-forest px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <p className="font-display text-lg font-bold text-forest">5CEE FARMS LTD</p>
        <p className="text-xs uppercase tracking-widest text-charcoal/50">Admin Panel</p>
        <h1 className="mt-4 text-xl font-bold">Admin Login</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}