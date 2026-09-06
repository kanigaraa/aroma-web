"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending || session?.user?.role !== "admin") {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="mt-2">Hanya admin yang bisa mengakses halaman ini.</p>
      {session?.user && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p><strong>Nama:</strong> {session.user.name}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>Role:</strong> {session.user.role}</p>
          <p><strong>Provinsi:</strong> {session.user.province || "Belum dipilih"}</p>
        </div>
      )}
    </div>
  );
}