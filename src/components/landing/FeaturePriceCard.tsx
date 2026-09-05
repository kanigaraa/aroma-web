"use client";

import { useState } from "react";
import DashboardChart from "@/components/DashboardChart";
import { RiskBadge } from "@/components/RiskBadge";
import type { ForecastPoint, Status } from "@/lib/types";
import styles from "@/app/landing.module.css";

export type FeatureCommodity = {
  slug: string;
  nama: string;
  satuan: string;
  status: Status;
  data: ForecastPoint[];
};

export default function FeaturePriceCard({ commodities, province }: { commodities: FeatureCommodity[]; province: string }) {
  const [selected, setSelected] = useState(commodities[0]?.slug ?? "");
  const commodity = commodities.find((item) => item.slug === selected);
  if (!commodity) return null;

  const chart = Object.fromEntries(commodities.map((item) => [item.slug, { [province]: item.data }]));

  return (
    <div className={styles.featurePriceCard}>
      <div className={styles.featurePriceHeader}>
        <div>
          <div className={styles.featurePriceTitle}><h3>Perbandingan Harga</h3><RiskBadge status={commodity.status} /></div>
          <p>Komoditas untuk wilayah {province}</p>
        </div>
        <label className={styles.featurePriceSelect}>
          <span className={styles.visuallyHidden}>Pilih komoditas</span>
          <select value={selected} onChange={(event) => setSelected(event.target.value)}>
            {commodities.map((item) => <option key={item.slug} value={item.slug}>{item.nama}</option>)}
          </select>
        </label>
      </div>
      <DashboardChart
        komoditas={commodities.map(({ slug, nama, satuan }) => ({ slug, nama, satuan }))}
        chart={chart}
        komo={selected}
        prov={province}
        height={150}
        compact
      />
    </div>
  );
}
