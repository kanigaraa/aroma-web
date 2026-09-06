"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/** warna untuk grafik perbandingan antar provinsi (dipakai juga utk legend) */
export const COMPARE_COLORS = ["#14b8a6", "#f97316", "#6366f1"];

export type ProvHistory = { tanggal: string; harga: number }[];

/** kontrol ambang alert harga per provinsi (tersimpan di parent via localStorage) */
export function AlertControl({
  current,
  satuan,
  threshold,
  onSet,
}: {
  current: number;
  satuan: string;
  threshold?: number;
  onSet: (v: number | null) => void;
}) {
  const [input, setInput] = useState("");
  const triggered = threshold != null && current >= threshold;
  return (
    <div>
      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          placeholder={`Contoh: ${Math.round(current * 1.05)}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 tnum"
        />
        <button
          onClick={() => {
            const v = Number(input);
            if (v > 0) onSet(v);
            setInput("");
          }}
          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          Set
        </button>
      </div>
      {threshold != null ? (
        <div className={`mt-2 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] ${triggered ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-700"}`}>
          <span>Ambang Rp {threshold.toLocaleString("id-ID")}/{satuan}</span>
          <span className="flex items-center gap-1 font-semibold">
            {triggered ? "Tembus!" : "Aman"}
          </span>
        </div>
      ) : (
        <div className="mt-1.5 text-[10px] text-secondary">
          Dapatkan peringatan saat harga mencapai ambang.
        </div>
      )}
      {threshold != null && (
        <button
          onClick={() => onSet(null)}
          className="mt-1 text-[10px] text-secondary underline hover:text-primary"
        >
          Hapus alert
        </button>
      )}
    </div>
  );
}

/** grafik perbandingan harga antar beberapa provinsi */
export function CompareChart({
  series,
  satuan,
}: {
  series: { prov: string; data: ProvHistory }[];
  satuan: string;
}) {
  if (series.length < 2) {
    return <div className="text-xs text-secondary py-6 text-center">Pilih minimal 2 provinsi untuk membandingkan.</div>;
  }
  // gabung jadi satu array tanggal (union) utk recharts
  const maxLen = Math.max(...series.map((s) => s.data.length));
  const merged: Record<string, number | string>[] = [];
  const base = series[0].data;
  base.forEach((b, i) => {
    const row: Record<string, number | string> = { tanggal: b.tanggal };
    series.forEach((s) => {
      row[s.prov] = s.data[i]?.harga ?? null;
    });
    if (i < maxLen) merged.push(row);
  });
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={merged} margin={{ top: 5, right: 5, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" vertical={false} />
        <XAxis
          dataKey="tanggal"
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          tickFormatter={(v: string) => v.slice(5)}
          minTickGap={30}
        />
        <YAxis
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          domain={["auto", "auto"]}
          tickFormatter={(v: number) => v.toLocaleString("id-ID")}
          width={48}
        />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid #eef1f5", boxShadow: "0 8px 24px rgba(13,27,42,0.08)", fontSize: 11 }}
          labelFormatter={((l: string) => `Tanggal ${l}`) as never}
        />
        {series.map((s, i) => (
          <Line
            key={s.prov}
            type="monotone"
            dataKey={s.prov}
            stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
            strokeWidth={2.2}
            dot={false}
            connectNulls
            name={`${s.prov} (Rp/${satuan})`}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/** grafik tren harga historis satu provinsi dengan rentang 30/90 hari */
export function TrendChart({
  data,
  range,
  satuan,
}: {
  data: ProvHistory;
  range: 30 | 90;
  satuan: string;
}) {
  const sliced = data.slice(-range);
  if (sliced.length < 2) {
    return <div className="text-xs text-secondary py-6 text-center">Data historis tidak tersedia.</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={sliced} margin={{ top: 5, right: 5, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" vertical={false} />
        <XAxis
          dataKey="tanggal"
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          tickFormatter={(v: string) => v.slice(5)}
          minTickGap={30}
        />
        <YAxis
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          domain={["dataMin - 200", "dataMax + 200"]}
          tickFormatter={(v: number) => v.toLocaleString("id-ID")}
          width={48}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #eef1f5",
            boxShadow: "0 8px 24px rgba(13,27,42,0.08)",
            fontSize: 11,
          }}
          formatter={((v: number) => [v.toLocaleString("id-ID"), `Harga (Rp/${satuan})`]) as never}
          labelFormatter={((l: string) => `Tanggal ${l}`) as never}
        />
        <Line
          type="monotone"
          dataKey="harga"
          stroke="#14b8a6"
          strokeWidth={2.5}
          dot={false}
          name="Harga"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
