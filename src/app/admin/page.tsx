"use client";

import { useSession } from "@/lib/auth-client";

export default function AdminPage() {
  const { data: session } = useSession();

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