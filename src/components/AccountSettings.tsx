"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, MapPin, Save, User } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { provinceIdFor } from "@/lib/provinces";

type SettingsUser = {
  id: string;
  name: string;
  email: string;
  region?: string | null;
  notifications?: boolean | null;
  provinceName?: string | null;
};

export default function AccountSettings({ provinces }: { provinces: string[] }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <main className="flex-1 px-6 py-6 text-sm text-secondary lg:px-8">Memuat profil akun...</main>;
  }
  if (!session) {
    return <main className="flex-1 px-6 py-6 text-sm text-red-600 lg:px-8">Sesi tidak ditemukan. Silakan masuk kembali.</main>;
  }

  return <SettingsForm key={session.user.id} user={session.user} provinces={provinces} />;
}

function SettingsForm({ user, provinces }: { user: SettingsUser; provinces: string[] }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const savedRegion = user.provinceName ?? user.region;
  const [region, setRegion] = useState(provinces.includes(savedRegion ?? "") ? savedRegion! : "DKI Jakarta");
  const [notifications, setNotifications] = useState(user.notifications ?? true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const save = async () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Nama tidak boleh kosong.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setError("");
    const provinceId = provinceIdFor(region);
    if (!provinceId) {
      setError("Wilayah tidak valid.");
      setStatus("error");
      return;
    }
    const response = await fetch("/api/account/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cleanName, province: region, notifications }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setError(result.error ?? "Perubahan belum dapat disimpan.");
      setStatus("error");
      return;
    }
    setStatus("saved");
    router.refresh();
  };

  return (
    <main className="flex-1 min-w-0 px-6 py-6 lg:px-8 max-w-[760px]">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-primary">Pengaturan Akun</h1>
        <p className="mt-1 text-sm text-secondary">Kelola profil, wilayah, dan preferensi notifikasi.</p>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">Profil</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-secondary" htmlFor="account-name">Nama</label>
            <input id="account-name" value={name} onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary" htmlFor="account-email">Email</label>
            <input id="account-email" value={user.email} disabled
              className="mt-1 w-full rounded-xl border border-border bg-muted px-3.5 py-2.5 text-sm text-secondary outline-none" />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">Wilayah Utama</h2>
        </div>
        <p className="mb-3 text-xs text-secondary">Grafik perbandingan harga di dashboard mengikuti wilayah ini.</p>
        <select value={region} onChange={(event) => setRegion(event.target.value)}
          aria-label="Wilayah utama"
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent">
          {provinces.map((province) => <option key={province} value={province}>{province}</option>)}
        </select>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" />
            <div>
              <h2 className="text-sm font-semibold text-primary">Notifikasi</h2>
              <p className="text-xs text-secondary">Preferensi notifikasi akun untuk fitur pengingat yang tersinkron.</p>
            </div>
          </div>
          <button type="button" onClick={() => setNotifications((value) => !value)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${notifications ? "bg-teal-600" : "bg-muted"}`}
            aria-label="Notifikasi harga" aria-pressed={notifications}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${notifications ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={status === "saving"}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60">
          <Save className="h-4 w-4" /> {status === "saving" ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        {status === "saved" && <span className="text-sm font-medium text-teal-600">Perubahan tersimpan.</span>}
        {error && <span className="text-sm font-medium text-red-600">{error}</span>}
      </div>
    </main>
  );
}
