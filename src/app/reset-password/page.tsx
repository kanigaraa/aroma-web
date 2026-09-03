"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { if (!token) setErr("Token tidak valid atau kadaluarsa."); }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) { setErr("Kata sandi minimal 8 karakter."); return; }
    if (pw !== pw2) { setErr("Kata sandi tidak cocok."); return; }
    setLoading(true); setErr("");
    const res = await authClient.resetPassword({ newPassword: pw, token });
    setLoading(false);
    if (res.error) { setErr(res.error.message ?? "Reset gagal."); return; }
    setDone(true);
    setTimeout(() => router.replace("/login"), 2000);
  };

  return (
    <AuthShell mode="login">
      <div className="mt-8">
        <h1 className="text-[28px] font-bold tracking-tight text-primary">Reset Kata Sandi</h1>
        <p className="mt-1.5 text-sm text-secondary">Masukkan kata sandi baru kamu.</p>
      </div>

      {done ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Kata sandi berhasil direset. Mengalihkan ke halaman masuk...
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Kata Sandi Baru</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-primary placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-primary placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>

          {err && <p className="text-xs font-medium text-red-500">{err}</p>}

          <button type="submit" disabled={loading || !token}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>;
}
