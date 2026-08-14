"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import AuthInput from "@/components/auth/AuthInput";

export default function ProfilePage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Awka");
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Populate the form once we know who's logged in.
  useEffect(() => {
    if (!user) return;
    setFullName((user.user_metadata?.full_name as string) ?? "");
    setPhone((user.user_metadata?.phone as string) ?? "");
    setAddress((user.user_metadata?.address as string) ?? "");
    setCity((user.user_metadata?.city as string) ?? "Awka");
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSavedMessage(null);
    setSaving(true);

    // Supabase stores custom profile fields on the user object itself
    // (user_metadata) — no separate "profiles" table needed for this.
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, phone, address, city },
    });

    setSaving(false);
    if (error) {
      console.error("Profile update error:", error);
      setError(error.message);
      return;
    }
    setSavedMessage("Saved.");
  }

  return (
    <div>
      <span className="section-eyebrow text-gold-dark">Account</span>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Profile</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Keep your details up to date for faster checkout.
      </p>

      <form
        onSubmit={handleSave}
        className="mt-6 space-y-5 rounded-2xl border border-forest/10 bg-white p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">Email</span>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="rounded-lg border border-forest/10 bg-forest/5 px-3 py-2.5 text-charcoal/50"
            />
          </label>
          <AuthInput
            label="Phone Number"
            type="tel"
            placeholder="0706 130 2674"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-charcoal/80">City / Town</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
            >
              <option>Awka</option>
              <option>Onitsha</option>
              <option>Nnewi</option>
              <option>Other (Southeast)</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-charcoal/80">Saved Delivery Address</span>
          <input
            type="text"
            placeholder="Street, house number, landmark"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-lg border border-forest/20 px-3 py-2.5 focus:border-forest focus:outline-none"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {savedMessage && (
          <p className="rounded-lg bg-forest/5 px-3 py-2 text-sm text-forest">{savedMessage}</p>
        )}

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}