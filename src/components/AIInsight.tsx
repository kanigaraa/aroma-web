"use client";

import { Sparkles } from "lucide-react";

type Props = {
  rows: { nama: string; avg: number | null; dir: number; delta: number; status: string; satuan: string }[];
  lastTanggal: string;
  provinsi: string[];
};

export default function AIInsight({ rows, lastTanggal, provinsi }: Props) {
  const notable = rows.filter((row) => row.status !== "stabil").slice(0, 2);
  const text = notable.length
    ? `${notable.map((row) => `${row.nama} berstatus ${row.status}`).join(" dan ")}. Periksa detail komoditas sebelum mengambil keputusan.`
    : "Belum ada komoditas berstatus waspada atau tinggi pada data yang tersedia.";

  return (
    <div className="mb-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-emerald-50 p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="text-sm font-bold text-primary">Ringkasan Data</div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-secondary">
        {text} Data {lastTanggal}; {provinsi.length} provinsi tersedia.
      </p>
    </div>
  );
}
