"use client";

import { MAP_W, MAP_H, type MapProvince } from "@/lib/mapData";
import type { Status } from "@/lib/types";

const STATUS_FILL: Record<Status, string> = {
  stabil: "#14b8a6",
  waspada: "#f59e0b",
  tinggi: "#ef4444",
};

const titleCase = (s: string) =>
  s.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const matchKey = (name: string, status: Record<string, Status>) =>
  Object.keys(status).find((k) => k.toLowerCase() === name.toLowerCase()) ?? titleCase(name);

export type MapFilter = "semua" | Status;

type Props = {
  status: Record<string, Status>;
  paths: MapProvince[];
  centroids: Record<string, { x: number; y: number }>;
  selected?: string;
  hover?: string | null;
  filter?: MapFilter;
  onHover?: (prov: string | null, pos?: { clientX: number; clientY: number }) => void;
  onSelect?: (prov: string) => void;
  className?: string;
};

export default function IndonesiaMap({
  status,
  paths,
  centroids,
  selected,
  hover,
  filter = "semua",
  onHover,
  onSelect,
  className = "",
}: Props) {
  const interactive = Boolean(onHover || onSelect);
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Peta Indonesia status risiko untuk ${Object.keys(centroids).length} provinsi`}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      onMouseLeave={() => onHover?.(null)}
    >
      {paths.map(({ name, path }) => {
        const key = matchKey(name, status);
        const st = status[key];
        const fill = st ? STATUS_FILL[st] : "#eef1f5";
        // filter: non-match tak bisa diklik & diredupkan
        const filteredOut = filter !== "semua" && st !== filter;
        const isHover = hover === name;
        const isSel = selected?.toLowerCase() === name.toLowerCase();
        // saat ada hover aktif, redupkan yang lain biar hover jelas
        const dimOthers = hover && !isHover;
        const opacity = filteredOut
          ? 0.12
          : dimOthers
            ? 0.78
            : isHover || isSel
              ? 1
              : 0.85;
        const stroke = isHover
          ? "#0f766e"
          : isSel
            ? "#0d9488"
            : "#ffffff";
        const strokeWidth = isHover || isSel ? 1.4 : 0.7;
        return (
          <path
            key={name}
            d={path}
            fill={fill}
            fillOpacity={opacity}
            stroke={stroke}
            strokeWidth={strokeWidth}
            className={filteredOut || !interactive ? "cursor-default" : "cursor-pointer transition-all duration-150"}
            onMouseEnter={(e) => {
              if (filteredOut) return;
              onHover?.(name, { clientX: e.clientX, clientY: e.clientY });
            }}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => !filteredOut && onSelect?.(name)}
          >
            <title>{name}</title>
          </path>
        );
      })}
    </svg>
  );
}
