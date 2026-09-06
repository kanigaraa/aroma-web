"use client";

import { useEffect, useState } from "react";
import { MapPin, Bell, Save } from "lucide-react";
import { useSession } from "@/lib/auth-client";

type Profile = { name: string; email: string; image: string | null; provinceName: string | null };

const PROVINSI = ["Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Bengkulu", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Lampung", "Banten", "Jawa Barat", "DKI Jakarta", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara", "Maluku", "Maluku Utara", "Papua Barat", "Papua"];

export default function PengaturanPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nama, setNama] = useState("");
  const [wilayah, setWilayah] = useState("");
  const [notif, setNotif] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/user/province").then((res) => res.json()).then((data) => {
      setProfile(data);
      setNama(data.name ?? session?.user?.name ?? "");
      setWilayah(data.provinceName ?? "DKI Jakarta");
    }).catch(() => setStatus("error"));
  }, [session?.user?.name]);

  const save = async () => {
    if (!profile || !nama.trim() || !wilayah) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/user/province", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provinceId: PROVINSI.indexOf(wilayah) + 1, provinceName: wilayah, name: nama }) });
      if (!res.ok) throw new Error();
      setProfile({ ...profile, name: nama, provinceName: wilayah });
      setStatus("saved");
    } catch { setStatus("error"); }
  };

  const image = profile?.image ?? session?.user?.image;
  const initial = (nama || profile?.name || session?.user?.name || "A").trim().charAt(0).toUpperCase();
  return <main className="flex-1 min-w-0 max-w-[760px] px-6 py-6 lg:px-8">
    <div className="mb-6"><h1 className="text-[28px] font-bold tracking-tight text-primary">Pengaturan Akun</h1><p className="mt-1 text-sm text-secondary">Kelola profil, wilayah, dan preferensi notifikasi.</p></div>
    <section className="rounded-2xl border border-border bg-surface p-5"><div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-teal-600 text-sm font-bold text-white">{image ? <img src={image} alt="Foto profil" className="h-full w-full object-cover" /> : initial}</span><div><h2 className="text-base font-semibold text-primary">Profil</h2><p className="text-xs text-secondary">Data akun sedang masuk.</p></div></div><div className="space-y-4"><label className="block text-sm font-medium text-secondary">Nama<input value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent" /></label><label className="block text-sm font-medium text-secondary">Email<input value={profile?.email ?? session?.user?.email ?? ""} disabled className="mt-1.5 w-full rounded-xl border border-border bg-muted px-3.5 py-2.5 text-sm text-secondary outline-none" /></label></div></section>
    <section className="mt-5 rounded-2xl border border-border bg-surface p-5"><div className="mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /><h2 className="text-base font-semibold text-primary">Wilayah Utama</h2></div><p className="mb-3 text-sm text-secondary">Harga dashboard mengikuti wilayah ini setelah disimpan.</p><select value={wilayah} onChange={(e) => setWilayah(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent">{PROVINSI.map((p) => <option key={p}>{p}</option>)}</select></section>
    <section className="mt-5 rounded-2xl border border-border bg-surface p-5"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2"><Bell className="h-4 w-4 text-accent" /><div><h2 className="text-base font-semibold text-primary">Notifikasi</h2><p className="text-sm text-secondary">Status tampilan aplikasi. Alert harga tersimpan per perangkat.</p></div></div><button onClick={() => setNotif((value) => !value)} className={`relative h-6 w-11 rounded-full ${notif ? "bg-teal-600" : "bg-muted"}`} aria-label="Toggle notifikasi"><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${notif ? "left-[22px]" : "left-0.5"}`} /></button></div></section>
    <div className="mt-6 flex items-center gap-3"><button onClick={save} disabled={!profile || status === "saving"} className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Save className="h-4 w-4" />{status === "saving" ? "Menyimpan..." : "Simpan Perubahan"}</button>{status === "saved" && <span className="text-sm font-medium text-teal-600">Tersimpan</span>}{status === "error" && <span className="text-sm font-medium text-red-600">Gagal menyimpan.</span>}</div>
  </main>;
}
