"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

type Props = {
  rows: { nama: string; avg: number | null; dir: number; delta: number; status: string; satuan: string }[];
  lastTanggal: string;
  provinsi: string[];
};

type InsightResponse = { text?: string | null };

export default function AIInsight({ rows, lastTanggal, provinsi }: Props) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(false);
    try {
      const r = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows, lastTanggal, provinsi }),
      });
      const d = await r.json() as InsightResponse;
      setText(d.text || null);
      if (!d.text) setErr(true);
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
  }, [lastTanggal, provinsi, rows]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <div className="mb-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50 p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="text-sm font-bold text-primary">Ringkasan Hari Ini</div>
        <button
          onClick={load}
          disabled={loading}
          className="ml-auto rounded-full p-1.5 text-secondary transition-colors hover:bg-teal-100 hover:text-teal-700 disabled:opacity-40"
          aria-label="Regenerasi insight"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-secondary">
        {loading
          ? "Menganalisis data pangan terkini..."
          : err
          ? "Insight tidak dapat dimuat saat ini."
          : text}
      </p>
    </div>
  );
}
