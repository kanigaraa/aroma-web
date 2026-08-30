"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Point = { tanggal: string; harga: number | null; forecast: number; is_future?: boolean };

type Props = {
  nama: string;
  satuan: string;
  seri: Point[];
  horizonDays: number;
};

// ringkas arah prediksi 7 hari & horizon penuh dalam kalimat sederhana
export default function ForecastAlert({ nama, satuan, seri, horizonDays }: Props) {
  const r = useMemo(() => {
    const last = seri.filter((p) => !p.is_future && p.forecast != null).slice(-1)[0];
    const future = seri.filter((p) => p.is_future && p.forecast != null);
    if (!last || future.length < 2) return null;
    const base = last.forecast;
    const d7 = future[Math.min(6, future.length - 1)];
    const dend = future[future.length - 1];
    if (!d7 || !dend) return null;
    const pct7 = ((d7.forecast - base) / base) * 100;
    const pctEnd = ((dend.forecast - base) / base) * 100;
    return {
      base,
      pct7,
      pctEnd,
      maxPct: Math.max(...future.map((p) => ((p.forecast - base) / base) * 100)),
      minPct: Math.min(...future.map((p) => ((p.forecast - base) / base) * 100)),
    };
  }, [seri]);

  if (!r) return null;

  const { pct7, pctEnd, maxPct, minPct, base } = r;
  const up = pctEnd >= 0;
  const Icon = Math.abs(pctEnd) < 0.5 ? Minus : up ? TrendingUp : TrendingDown;
  const tone = Math.abs(pctEnd) < 0.5
    ? "bg-gray-50 text-gray-600 border-gray-200"
    : up
    ? "bg-red-50 text-red-600 border-red-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";
  const pct = (v: number) => `${Math.abs(v).toFixed(1)}%`;

  const msg =
    Math.abs(pctEnd) < 0.5
      ? `Harga ${nama} diprediksi tetap stabil dalam ${horizonDays} hari ke depan, berkisar Rp${Math.round(Math.min(base, base * (1 + minPct / 100))).toLocaleString("id-ID")}–Rp${Math.round(Math.max(base, base * (1 + maxPct / 100))).toLocaleString("id-ID")} per ${satuan}.`
      : `Diprediksi harga ${nama} ${up ? "naik" : "turun"} sekitar ${pct(pct7)} dalam 7 hari, dan ${pct(pctEnd)} dalam ${horizonDays} hari ke depan (kisaran ${pct(minPct)} s.d. ${pct(maxPct)}).`;

  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${tone}`}>
      <span className="mt-0.5">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-sm font-semibold">Prediksi Harga</div>
        <p className="mt-0.5 text-[13px] leading-relaxed opacity-90">{msg}</p>
      </div>
    </div>
  );
}
