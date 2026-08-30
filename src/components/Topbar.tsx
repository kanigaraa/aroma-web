"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, User, Settings, LogOut, CheckCircle2 } from "lucide-react";

export type Notif = {
  id: string;
  title: string;
  body: string;
  time: string;
};

export default function Topbar() {
  const [open, setOpen] = useState<null | "notif" | "user">(null);
  const ref = useRef<HTMLDivElement>(null);

  // notifikasi contoh (nanti dari alert harga)
  const notifs: Notif[] = [
    { id: "1", title: "Cabai Rawit naik", body: "Cabai Rawit naik 4% di 6 provinsi.", time: "2 jam lalu" },
    { id: "2", title: "Beras stabil", body: "Harga beras nasional stabil pekan ini.", time: "Kemarin" },
  ];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (k: "notif" | "user") => setOpen((o) => (o === k ? null : k));

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-end gap-2 border-b border-border bg-surface px-6">
      <div ref={ref} className="flex items-center gap-2">
        {/* Notif bell */}
        <button
          onClick={() => toggle("notif")}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-secondary transition-colors hover:bg-muted hover:text-primary"
          aria-label="Notifikasi"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {notifs.length}
          </span>
        </button>

        {/* Avatar / pengaturan akun */}
        <button
          onClick={() => toggle("user")}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white"
          aria-label="Akun"
        >
          A
        </button>

        {open === "notif" && (
          <div className="absolute right-6 top-16 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold text-primary">Notifikasi</span>
              <span className="text-xs text-secondary">{notifs.length} baru</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifs.map((n) => (
                <div key={n.id} className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-primary">{n.title}</div>
                    <div className="text-xs text-secondary">{n.body}</div>
                    <div className="mt-0.5 text-[10px] text-secondary/70">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {open === "user" && (
          <div className="absolute right-6 top-16 z-50 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="border-b border-border px-4 py-3">
              <div className="text-sm font-bold text-primary">Pengguna Demo</div>
              <div className="text-xs text-secondary">pengguna@aroma.id</div>
            </div>
            <div className="p-1.5">
              <Link href="/pengaturan" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-secondary transition-colors hover:bg-muted hover:text-primary">
                <User className="h-4 w-4" /> Profil
              </Link>
              <Link href="/pengaturan" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-secondary transition-colors hover:bg-muted hover:text-primary">
                <Settings className="h-4 w-4" /> Pengaturan
              </Link>
              <button onClick={() => alert("Logout (demo)")} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
