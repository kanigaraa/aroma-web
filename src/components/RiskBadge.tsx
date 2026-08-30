import type { Status } from "@/lib/types";

const STATUS_STYLE: Record<Status, { label: string; cls: string }> = {
  stabil: { label: "Stabil", cls: "bg-teal-50 text-teal-700" },
  waspada: { label: "Waspada", cls: "bg-amber-50 text-amber-700" },
  tinggi: { label: "Tinggi", cls: "bg-red-50 text-red-600" },
};

export function RiskBadge({ status }: { status: Status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.stabil;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ringkas status dari seri terakhir (rata-rata provinsi)
export function summarizeStatus(
  data: { tanggal: string; data: Record<string, { status: Status }> }[]
): Status {
  const last = data[data.length - 1];
  if (!last) return "stabil";
  const statuses = Object.values(last.data)
    .map((d) => d.status)
    .filter(Boolean);
  if (!statuses.length) return "stabil";
  const score = { stabil: 0, waspada: 1, tinggi: 2 };
  const avg = statuses.reduce((a, s) => a + score[s], 0) / statuses.length;
  if (avg >= 1.5) return "tinggi";
  if (avg >= 0.5) return "waspada";
  return "stabil";
}
