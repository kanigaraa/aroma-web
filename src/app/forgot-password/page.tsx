"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErr("Email wajib diisi."); return; }
    setLoading(true); setErr("");
    const res = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setLoading(false);
    if (res.error) { setErr(res.error.message ?? "Gagal mengirim email."); return; }
    setSent(true);
  };

  return (
    <AuthShell mode="login">
      {sent ? (
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Link reset kata sandi telah dikirim ke <strong>{email}</strong>. Cek inbox kamu.
        </div>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <p className="text-sm text-secondary">Masukkan email kamu dan kami akan mengirimkan link untuk mereset kata sandi.</p>
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

          {err && <p className="text-xs font-medium text-red-500">{err}</p>}

          <button
            type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-secondary">
        Ingat kata sandi?{" "}
        <a href="/login" className="font-medium text-accent-strong hover:underline">Masuk</a>
      </p>
    </AuthShell>
  );
}
