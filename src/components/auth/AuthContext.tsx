"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

type AuthCtx = {
  user: { email: string; name: string } | null;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();

  const logout = useCallback(async () => {
    await signOut();
    router.replace("/login");
  }, [router]);

  const user = session?.user
    ? { email: session.user.email, name: session.user.name ?? session.user.email }
    : null;

  return <Ctx.Provider value={{ user, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
