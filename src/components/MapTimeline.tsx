"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipBack } from "lucide-react";
import IndonesiaMap from "./IndonesiaMap";
import { RiskBadge } from "./RiskBadge";
import type { MapProvince } from "@/lib/mapData";
import type { Status } from "@/lib/types";

type DayStatus = {
  tanggal: string;
  status: Record<string, Status>;
};

type Props = {
  slug: string;
  nama: string;
  paths: MapProvince[];
  centroids: Record<string, { x: number; y: number }>;
  days: DayStatus[]; // status per tanggal (terbaru di akhir)
};

export default function MapTimeline({
  slug,
  nama,
  paths,
  centroids,
  days,
}: Props) {
  const [idx, setIdx] = useState(days.length - 1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const frame = (i: number) => setIdx(Math.max(0, Math.min(days.length - 1, i)));

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setIdx((i) => {
          if (i <= 0) { setPlaying(false); return 0; }
          return i - 1;
        });
      }, 250);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing]);

  const day = days[idx];
  const status = day?.status ?? {};
  const pct = days.length ? (idx / (days.length - 1)) * 100 : 0;

  const counts = { stabil: 0, waspada: 0, tinggi: 0 };
  Object.values(status).forEach((s) => { counts[s] = (counts[s] ?? 0) + 1; });

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-primary">Pergerakan Risiko · {nama}</h3>
          <p className="mt-0.5 text-xs text-secondary">
            Animasikan 30 hari terakhir · {day?.tanggal ?? ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setPlaying(false); setIdx(days.length - 1); }}
            aria-label="Kembali ke terbaru"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-primary hover:bg-muted"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Jeda" : "Putar"}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 text-sm font-semibold text-white hover:opacity-90"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Jeda" : "Putar"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="relative overflow-hidden rounded-xl bg-muted/50">
          <IndonesiaMap
            status={status}
            paths={paths}
            centroids={centroids}
            className="w-full"
          />
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span className="text-xs text-secondary">Stabil</span>
            <span className="font-semibold text-primary tnum">{counts.stabil}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3">
            <span className="text-xs font-medium text-amber-700">Waspada</span>
            <span className="font-semibold text-amber-700 tnum">{counts.waspada}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3">
            <span className="text-xs font-medium text-red-600">Tinggi</span>
            <span className="font-semibold text-red-600 tnum">{counts.tinggi}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(days.length - 1, 1)}
            value={idx}
            onChange={(e) => { setPlaying(false); frame(Number(e.target.value)); }}
            className="w-full accent-[var(--accent)]"
            aria-label="Tanggal"
          />
          <div className="text-center text-[11px] text-secondary tnum">{day?.tanggal ?? ""}</div>
        </div>
      </div>
    </div>
  );
}
