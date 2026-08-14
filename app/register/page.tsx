"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthInput from "@/components/auth/AuthInput";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    setLoading(false);

    if (error) {
      console.error("Sign up error:", error);
      setError(error.message);
      return;
    }

    // Supabase returns success with an empty identities array if this
    // email is already registered (this prevents attackers from being
    // able to tell which emails have accounts) — flag it clearly instead
    // of silently showing "check your email" for an email that already exists.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError("An account with this email already exists. Try logging in instead.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-16 lg:py-24">
        <span className="section-eyebrow text-gold-dark">Create Account</span>
        <h1 className="mt-2 text-3xl font-bold">Join Chiso Foods</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Create an account to track orders, save your delivery address, and
          check out faster next time.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="mt-4 font-display text-sm font-bold text-forest">
              Check your email
            </p>
            <p className="mt-1 text-sm text-charcoal/70">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>.
              Confirm your email, then log in below.
            </p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="btn-primary mt-6 w-full"
            >
              Go to Login
            </button>
            <p className="mt-3 text-xs text-charcoal/50">
              Nothing happening?{" "}
              <Link href="/login" className="underline">
                Click here
              </Link>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-forest/10 bg-white p-6">
            <AuthInput
              label="Full Name"
              type="text"
              placeholder="e.g. Ngozi Adaeze"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthInput
              label="Phone Number"
              type="tel"
              placeholder="0706 130 2674"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <AuthInput
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-center text-sm text-charcoal/70">
              Already have an account?{" "}
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