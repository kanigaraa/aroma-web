"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { authClient, useSession } from "@/lib/auth-client";

export default function ProvinceOnboarding({ provinces }: { provinces: string[] }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [province, setProvince] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session) router.replace("/login");
    else if (session.user.provinceName) router.replace("/dashboard");
  }, [isPending, router, session]);

  if (isPending || !session || session.user.provinceName) return null;

  const save = async () => {
    if (!province) return;
    setSaving(true);
    setError("");
    const result = await authClient.updateUser({
      provinceId: provinces.indexOf(province) + 1,
      provinceName: province,
      region: province,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error.message ?? "Gagal menyimpan. Coba lagi.");
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <AuthShell mode="register">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary">Pilih Provinsi</h2>
          <p className="mt-1 text-sm text-secondary">Wilayah pemantauan harga Anda</p>
        </div>
        <select value={province} onChange={(event) => setProvince(event.target.value)} className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40">
          <option value="">-- Pilih Provinsi --</option>
          {provinces.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <button type="button" disabled={!province || saving} onClick={save} className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60">
          {saving ? "Menyimpan..." : "Lanjut ke Dashboard"}
          {!saving && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </AuthShell>
  );
}
