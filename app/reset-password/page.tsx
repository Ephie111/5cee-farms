"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthInput from "@/components/auth/AuthInput";
import { supabase } from "@/lib/supabase";

type SessionStatus = "checking" | "ready" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<SessionStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase fires this specific event once it's parsed the recovery
    // token from the email link's URL and set up a temporary session
    // that's only valid for changing the password.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStatus("ready");
    });

    // The event may have already fired before this component mounted —
    // check directly too, so a real refresh doesn't get stuck.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus("ready");
    });

    // If neither the event nor an existing session shows up in a few
    // seconds, this wasn't opened from a valid reset link.
    const timeout = setTimeout(() => {
      setStatus((current) => (current === "checking" ? "invalid" : current));
    }, 4000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      console.error("Update password error:", error);
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-16 lg:py-24">
        <span className="section-eyebrow text-gold-dark">Account Recovery</span>
        <h1 className="mt-2 text-3xl font-bold">Set a New Password</h1>

        {status === "checking" && (
          <p className="mt-8 text-center text-sm text-charcoal/50">Checking your reset link…</p>
        )}

        {status === "invalid" && (
          <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-6 text-center">
            <p className="text-sm text-charcoal/70">
              This link is invalid or has expired. Password reset links only work for a short time after being sent.
            </p>
            <Link href="/forgot-password" className="btn-primary mt-6 inline-flex">
              Request a New Link
            </Link>
          </div>
        )}

        {status === "ready" && (
          success ? (
            <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="mt-4 font-display text-sm font-bold text-forest">Password updated</p>
              <p className="mt-1 text-sm text-charcoal/70">Taking you to login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-forest/10 bg-white p-6">
              <AuthInput
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <AuthInput
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )
        )}
      </main>
      <Footer />
    </>
  );
}