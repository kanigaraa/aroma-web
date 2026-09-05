"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signUp, signIn, authClient } from "@/lib/auth-client";
import CommodityIcon from "@/components/CommodityIcon";

type Step = "form" | "otp";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signUp.email({ name, email, password });
    if (res.error) {
      setError(res.error.message ?? "Gagal mendaftar");
      setLoading(false);
      return;
    }
    // kirim OTP verifikasi email
    const otpRes = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
    if (otpRes.error) {
      setError(otpRes.error.message ?? "Gagal mengirim OTP");
      setLoading(false);
      return;
    }
    setStep("otp");
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await authClient.emailOtp.verifyEmail({ email, otp });
    if (res.error) {
      setError(res.error.message ?? "OTP tidak valid");
      setLoading(false);
      return;
    }
    window.location.href = "/dashboard";
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  async function resendOtp() {
    setError("");
    await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
  }

  return (
    <div className="flex min-h-screen">
      {/* ilustrasi */}
      <div className="hidden md:flex w-[58%] sticky top-0 h-screen overflow-hidden">
        <Image
          src="/auth-register.webp"
          alt="Mulai"
          fill
          className="object-cover object-left"
          priority
        />
      </div>

      {/* form */}
      <div className="flex flex-1 items-center justify-center bg-[#f4f7f5] px-6 py-12">
        <div className="w-full max-w-[340px] flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2">
            <CommodityIcon slug="beras" nama="AROMA" size={28} />
            <span className="font-semibold text-lg tracking-tight">AROMA</span>
          </Link>

          {step === "form" ? (
            <>
              <div>
                <h1 className="text-2xl font-bold">Mulai sekarang</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="underline underline-offset-2">
                    Masuk
                  </Link>
                </p>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Adla Fayyaz"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="kamu@email.com"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Kata Sandi</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white rounded-md py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Memproses…" : "Daftar"}
                </button>
              </form>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                atau
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="flex items-center justify-center gap-2 border rounded-md py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Lanjut dengan Google
              </button>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold">Verifikasi email</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Kode OTP dikirim ke <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Kode OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 tracking-[0.5em] text-center text-lg font-mono"
                    placeholder="123456"
                    autoFocus
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="bg-green-600 text-white rounded-md py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Memverifikasi…" : "Verifikasi"}
                </button>
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  Kirim ulang kode
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
