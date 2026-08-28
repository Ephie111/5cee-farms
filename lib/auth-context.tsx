"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type Role = "customer" | "admin" | "super_admin";
export type AccountStatus = "active" | "pending_invitation" | "inactive" | "suspended" | "resigned";

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  status: AccountStatus | null;
  loading: boolean; // true until we know the session, role, AND status
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  status: null,
  loading: true,
  signOut: async () => {},
});

/**
 * Wraps the whole app (see app/layout.tsx). Keeps track of whether
 * someone is logged in, their role, and their account status — by
 * asking Supabase for the current session on load, then listening for
 * sign-in / sign-out events afterwards.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [status, setStatus] = useState<AccountStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single();
    setRole((data?.role as Role) ?? "customer");
    setStatus((data?.status as AccountStatus) ?? "active");
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadProfile(session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
        if (event === "SIGNED_IN") {
          // Records last_login and (for admin-tier accounts) a
          // "Successful login" activity log entry — see record_login()
          // in the database migration. Fire-and-forget: never block
          // sign-in on this.
          supabase.rpc("record_login").then(({ error }) => {
            if (error) console.error("record_login error:", error.message);
          });
        }
      } else {
        setRole(null);
        setStatus(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, role, status, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Use inside any client component: const { user, role, status, loading, signOut } = useAuth(); */
export function useAuth() {
  return useContext(AuthContext);
}