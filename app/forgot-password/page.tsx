"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthInput from "@/components/auth/AuthInput";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      console.error("Reset password error:", error);
      setError(error.message);
      return;
    }
    // Always show the same success message whether or not the email is
    // actually registered — this prevents the form from being used to
    // check which emails have accounts (a common privacy/security leak).
    setSubmitted(true);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-16 lg:py-24">
        <span className="section-eyebrow text-gold-dark">Account Recovery</span>
        <h1 className="mt-2 text-3xl font-bold">Forgot Password</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Enter the email on your account and we&apos;ll send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="mt-4 font-display text-sm font-bold text-forest">Check your email</p>
            <p className="mt-1 text-sm text-charcoal/70">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent.
            </p>
            <Link href="/login" className="btn-primary mt-6 inline-flex">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-forest/10 bg-white p-6">
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Sending…" : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-charcoal/70">
              Remembered your password?{" "}
              <Link href="/login" className="font-semibold text-forest hover:underline">
                Log in
              </Link>
            </p>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}