"use client";

import { useMemo } from "react";
import PriceChart from "./PriceChart";
import type { ForecastPoint } from "@/lib/types";

type Props = {
  komoditas: { slug: string; nama: string; satuan: string }[];
  chart: Record<string, Record<string, ForecastPoint[]>>; // komoditas -> provinsi -> seri
  komo: string; // komoditas aktif (parent pegang, sync ke peta risiko)
  prov: string; // wilayah tetap dari akun
};

export default function DashboardChart({
  komoditas,
  chart,
  komo,
  prov,
}: Props) {
  const k = komoditas.find((x) => x.slug === komo);
  const data = useMemo(() => chart[komo]?.[prov] ?? [], [komo, prov, chart]);

  return (
    <div>
      <div className="mt-3">
        <PriceChart data={data} satuan={k?.satuan ?? "kg"} height={320} />
      </div>
    </div>
  );
}
