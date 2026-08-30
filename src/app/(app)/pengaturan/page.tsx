"use client";

import { useState } from "react";
import { User, MapPin, Bell, LogOut, Save } from "lucide-react";

const PROVINSI = [
  "DKI Jakarta", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "Sumatera Utara",
  "Banten", "Sulawesi Selatan", "Kalimantan Timur", "Bali", "DI Yogyakarta",
];

export default function PengaturanPage() {
  const [nama, setNama] = useState("Pengguna Demo");
  const [wilayah, setWilayah] = useState("DKI Jakarta");
  const [notif, setNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="flex-1 min-w-0 px-6 py-6 lg:px-8 max-w-[760px]">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-primary">Pengaturan Akun</h1>
        <p className="text-sm text-secondary mt-1">Kelola profil, wilayah, dan preferensi notifikasi.</p>
      </div>

      {/* Profil */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">Profil</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-secondary">Nama</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-secondary">Email</label>
            <input
              value="pengguna@aroma.id"
              disabled
              className="mt-1 w-full rounded-xl border border-border bg-muted px-3.5 py-2.5 text-sm text-secondary outline-none"
            />
          </div>
        </div>
      </section>

      {/* Wilayah */}
      <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-primary">Wilayah Utama</h2>
        </div>
        <p className="mb-3 text-xs text-secondary">Harga yang tampil di dashboard disesuaikan dengan wilayah ini.</p>
        <select
          value={wilayah}
          onChange={(e) => setWilayah(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
        >
          {PROVINSI.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </section>

      {/* Notifikasi */}
      <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" />
            <div>
              <h2 className="text-sm font-semibold text-primary">Notifikasi</h2>
              <p className="text-xs text-secondary">Peringatan saat harga melewati ambang batas.</p>
            </div>
          </div>
          <button
            onClick={() => setNotif((n) => !n)}
            className={`relative h-6 w-11 rounded-full transition-colors ${notif ? "bg-teal-600" : "bg-muted"}`}
            aria-label="Toggle notifikasi"
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${notif ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </section>

      {/* Simpan + Logout */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={save}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          <Save className="h-4 w-4" /> Simpan Perubahan
        </button>
        {saved && <span className="text-sm font-medium text-teal-600">Tersimpan ✓</span>}
        <button
          onClick={() => alert("Logout (demo)")}
          className="ml-auto flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </main>
  );
}
