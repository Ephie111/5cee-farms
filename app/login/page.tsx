"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthInput from "@/components/auth/AuthInput";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      console.error("Login error:", error);
      // Supabase's raw message for this case is "Email not confirmed" —
      // reword it so it's obvious what to actually do next.
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError("Please confirm your email first — check the link we sent you when you registered.");
      } else if (error.message.toLowerCase().includes("invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(error.message);
      }
      return;
    }
    router.push("/");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-16 lg:py-24">
        <span className="section-eyebrow text-gold-dark">Welcome Back</span>
        <h1 className="mt-2 text-3xl font-bold">Log In</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Log in to view your orders and check out faster.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-forest/10 bg-white p-6">
          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="mt-1.5 text-right text-xs text-charcoal/50">
              <Link href="/forgot-password" className="text-forest hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Logging in…" : "Log In"}
          </button>

          <p className="text-center text-sm text-charcoal/70">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-forest hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  );
}