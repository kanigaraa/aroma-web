"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

// Redirect ke /login kalau belum autentikasi. Bungkus seluruh (app) group.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return <div className="flex min-h-screen items-center justify-center text-sm text-secondary">Memuat…</div>;

  return <>{children}</>;
}
