"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { signUp, authClient } from "@/lib/auth-client";

const PROVINCES = [
  { id: 11, name: "Aceh" }, { id: 12, name: "Sumatera Utara" },
  { id: 13, name: "Sumatera Barat" }, { id: 14, name: "Riau" },
  { id: 15, name: "Jambi" }, { id: 16, name: "Sumatera Selatan" },
  { id: 17, name: "Bengkulu" }, { id: 18, name: "Lampung" },
  { id: 19, name: "Kep. Bangka Belitung" }, { id: 21, name: "Kep. Riau" },
  { id: 31, name: "DKI Jakarta" }, { id: 32, name: "Jawa Barat" },
  { id: 33, name: "Jawa Tengah" }, { id: 34, name: "DI Yogyakarta" },
  { id: 35, name: "Jawa Timur" }, { id: 36, name: "Banten" },
  { id: 51, name: "Bali" }, { id: 52, name: "Nusa Tenggara Barat" },
  { id: 53, name: "Nusa Tenggara Timur" }, { id: 61, name: "Kalimantan Barat" },
  { id: 62, name: "Kalimantan Tengah" }, { id: 63, name: "Kalimantan Selatan" },
  { id: 64, name: "Kalimantan Timur" }, { id: 65, name: "Kalimantan Utara" },
  { id: 71, name: "Sulawesi Utara" }, { id: 72, name: "Sulawesi Tengah" },
  { id: 73, name: "Sulawesi Selatan" }, { id: 74, name: "Sulawesi Tenggara" },
  { id: 75, name: "Gorontalo" }, { id: 76, name: "Sulawesi Barat" },
  { id: 81, name: "Maluku" }, { id: 82, name: "Maluku Utara" },
  { id: 91, name: "Papua Barat" }, { id: 94, name: "Papua" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "province">("form");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState<{id: number; name: string} | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !pw) { setErr("Semua kolom wajib diisi."); return; }
    if (pw.length < 8) { setErr("Kata sandi minimal 8 karakter."); return; }
    setLoading(true); setErr("");
    const res = await signUp.email({ name, email, password: pw });
    if (res.error) {
      setLoading(false);
      setErr(res.error.message ?? "Pendaftaran gagal.");
      return;
    }
    await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    setLoading(false);
    setCooldown(60);
    setStep("otp");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { setErr("Masukkan kode 6 digit."); return; }
    setLoading(true); setErr("");
    const res = await authClient.emailOtp.verifyEmail({ email, otp });
    setLoading(false);
    if (res.error) { setErr(res.error.message ?? "Kode tidak valid."); return; }
    setStep("province");
  };

  const resendOtp = async () => {
    setErr("");
    const res = await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    if (res.error) setErr(res.error.message ?? "Gagal mengirim ulang OTP");
    else setCooldown(60);
  };

  if (step === "otp") {
    return (
      <AuthShell mode="register">
        <form className="space-y-4" onSubmit={verifyOtp}>
          <p className="text-sm text-muted-foreground">
            Kode verifikasi 6 digit dikirim ke <span className="font-medium text-foreground">{email}</span>
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Kode OTP</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input
                type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000" maxLength={6}
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-primary placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-accent/40 tracking-widest text-center font-mono"
              />
            </div>
          </div>
          {err && <p className="text-xs font-medium text-red-500">{err}</p>}
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60">
            {loading ? "Memuat..." : "Verifikasi"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
          <button type="button" onClick={resendOtp} disabled={cooldown > 0} className="w-full text-xs text-secondary hover:underline disabled:opacity-50">
            {cooldown > 0 ? `Kirim ulang dalam ${cooldown}d` : "Tidak terima kode? Kirim ulang"}
          </button>
        </form>
      </AuthShell>
    );
  }

  if (step === "province") {
    return (
      <AuthShell mode="register">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary">Pilih Provinsi</h2>
            <p className="mt-1 text-sm text-secondary">Wilayah pemantauan harga Anda</p>
          </div>
          <select
            value={selectedProvince?.id ?? ""}
            onChange={(e) => {
              const p = PROVINCES.find((x) => x.id === Number(e.target.value));
              setSelectedProvince(p ?? null);
            }}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">-- Pilih Provinsi --</option>
            {PROVINCES.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {err && <p className="text-xs font-medium text-red-500">{err}</p>}
          <button
            disabled={!selectedProvince || loading}
            onClick={async () => {
              if (!selectedProvince) return;
              setLoading(true); setErr("");
              try {
                const res = await fetch("/api/user/province", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ provinceId: selectedProvince.id, provinceName: selectedProvince.name }),
                });
                if (!res.ok) throw new Error();
                router.replace("/dashboard");
              } catch {
                setErr("Gagal menyimpan. Coba lagi.");
              } finally {
                setLoading(false);
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
          >
            {loading ? "Memuat..." : "Lanjut ke Dashboard"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell mode="register">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">Nama</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-primary placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-primary placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">Kata Sandi</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="password" value={pw} onChange={(e) => setPw(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-primary placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>
        {err && <p className="text-xs font-medium text-red-500">{err}</p>}
        <button
          type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          {loading ? "Memuat..." : "Daftar"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-secondary">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-accent-strong hover:underline">Masuk</Link>
      </p>
    </AuthShell>
  );
}