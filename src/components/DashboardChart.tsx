"use client";

import { useMemo } from "react";
import PriceChart from "./PriceChart";
import { RiskBadge } from "./RiskBadge";
import type { ForecastPoint, Status } from "@/lib/types";

type Props = {
  komoditas: { slug: string; nama: string; satuan: string }[];
  chart: Record<string, Record<string, ForecastPoint[]>>; // komoditas -> provinsi -> seri
  status: Record<string, Status>; // komoditas -> status nasional (utk badge)
  komo: string; // komoditas aktif (parent pegang, sync ke peta risiko)
  prov: string; // wilayah tetap dari akun
};

const STATUS: Record<string, Status> = {
  stabil: "stabil",
  waspada: "waspada",
  tinggi: "tinggi",
};

export default function DashboardChart({
  komoditas,
  chart,
  status,
  komo,
  prov,
}: Props) {
  const k = komoditas.find((x) => x.slug === komo);
  const data = useMemo(() => chart[komo]?.[prov] ?? [], [komo, prov, chart]);
  const stat: Status = STATUS[status[komo] ?? "stabil"];

  return (
    <div>
      <RiskBadge status={stat} />
      <div className="mt-3">
        <PriceChart data={data} satuan={k?.satuan ?? "kg"} height={320} />
      </div>
    </div>
  );
}
