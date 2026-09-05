"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, User, ShieldCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { signUp, signIn, authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

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
    // lanjut ke step verifikasi OTP
    await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    setLoading(false);
    setStep("otp");
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { setErr("Masukkan kode 6 digit."); return; }
    setLoading(true); setErr("");
    const res = await authClient.emailOtp.verifyEmail({ email, otp });
    setLoading(false);
    if (res.error) { setErr(res.error.message ?? "Kode tidak valid."); return; }
    router.replace("/dashboard");
  };

  const resendOtp = async () => {
    setErr("");
    await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
  };

  // ==== step OTP: layar verifikasi, style konsisten dengan AuthShell ====
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
              <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                autoFocus
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm tracking-[0.5em] text-primary placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
          {err && <p className="text-xs font-medium text-red-500">{err}</p>}
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
          >
            {loading ? "Memverifikasi..." : "Verifikasi email"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={resendOtp}
            className="w-full text-center text-sm text-secondary underline-offset-2 hover:underline"
          >
            Kirim ulang kode
          </button>
        </form>
      </AuthShell>
    );
  }

  // ==== step form: desain original (tidak diubah) ====
  return (
    <AuthShell mode="register">
      <button
        type="button"
        onClick={() => signIn.social({ provider: "google", callbackURL: "/dashboard" })}
        className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Daftar dengan Google
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-secondary">atau</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">Nama Lengkap</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
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
          type="submit"
          disabled={loading}
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
