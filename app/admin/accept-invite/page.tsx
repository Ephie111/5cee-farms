"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const CHECKS = [
  { key: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { key: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { key: "number", label: "One number", test: (p: string) => /\d/.test(p) },
];

function AcceptInviteContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const adminId = params.get("id");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const allChecksPass = CHECKS.every((c) => c.test(password));

  if (!token || !adminId) {
    return (
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-sm text-charcoal/70">This invitation link is missing required information.</p>
        <Link href="/admin/login" className="btn-primary mt-6 inline-flex">Go to Login</Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!allChecksPass) {
      setError("Please meet all password requirements below.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to set up your account.");

      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="mt-4 font-display text-sm font-bold text-forest">Account set up!</p>
        <p className="mt-1 text-sm text-charcoal/70">Taking you to login…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      <p className="font-display text-lg font-bold text-forest">5CEE FARMS LTD</p>
      <p className="text-xs uppercase tracking-widest text-charcoal/50">Welcome</p>
      <h1 className="mt-4 text-xl font-bold">Set Up Your Account</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Create a secure password to complete your administrator account setup.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Create Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-forest/20 px-3 py-2.5 pr-16 focus:border-forest focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-forest"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <ul className="space-y-1">
          {CHECKS.map((check) => {
            const pass = check.test(password);
            return (
              <li key={check.key} className={`flex items-center gap-1.5 text-xs ${pass ? "text-forest" : "text-charcoal/40"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  {pass ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  ) : (
                    <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                  )}
                </svg>
                {check.label}
              </li>
            );
          })}
        </ul>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Confirm Password</span>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Setting up…" : "Complete Setup"}
        </button>
      </form>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-forest px-6">
      <Suspense fallback={<p className="text-white/70 text-sm">Loading…</p>}>
        <AcceptInviteContent />
      </Suspense>
    </main>
  );
}