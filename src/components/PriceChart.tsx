"use client";

import { useState } from "react";
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ForecastPoint } from "@/lib/types";

type Props = {
  data: ForecastPoint[];
  satuan: string;
  height?: number;
};

const RANGES = [
  { label: "30H", days: 30 },
  { label: "90H", days: 90 },
  { label: "1T", days: 365 },
  { label: "Semua", days: 0 },
];

export default function PriceChart({ data, satuan, height = 340 }: Props) {
  const [range, setRange] = useState(90);
  const riil = data.filter((d) => !d.is_future);
  const cutoff = range === 0 ? riil[0]?.tanggal : riil[riil.length - range]?.tanggal;
  const shown = cutoff ? data.filter((d) => d.tanggal >= cutoff) : data;
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-end gap-1">
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setRange(r.days)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              range === r.days ? "bg-accent text-white" : "text-secondary hover:bg-muted hover:text-primary"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={shown}
          margin={{ top: 10, right: 20, bottom: 0, left: 10 }}
        >
          <defs>
            <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="tanggal"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v: string) => v.slice(5)}
            minTickGap={40}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            domain={["dataMin - 500", "dataMax + 500"]}
            tickFormatter={(v: number) => v.toLocaleString("id-ID")}
            width={70}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #eef1f5",
              boxShadow: "0 8px 24px rgba(13,27,42,0.08)",
              fontSize: 12,
            }}
            formatter={(value, name) => [
              value != null ? Number(value).toLocaleString("id-ID") : "-",
              name === "harga" ? `Harga (Rp/${satuan})` : name === "forecast" ? "Perkiraan 14 hari" : String(name),
            ]}
          />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="url(#band)"
            activeDot={false}
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="transparent"
            activeDot={false}
            legendType="none"
          />
          <Line
            type="monotone"
            dataKey="harga"
            stroke="#14b8a6"
            strokeWidth={2.5}
            dot={false}
            connectNulls
            name="harga"
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#f97316"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={false}
            connectNulls
            name="forecast"
          />
          <ReferenceLine
            x={riil.length ? riil[riil.length - 1].tanggal : undefined}
            stroke="#cbd5e1"
            strokeDasharray="3 3"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center gap-4 text-xs text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 bg-accent inline-block" /> Harga terbaru
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 bg-coral inline-block" /> Perkiraan 14 hari
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-5 bg-coral/20 inline-block rounded-sm" /> Rentang kemungkinan
        </span>
      </div>
    </div>
  );
}
