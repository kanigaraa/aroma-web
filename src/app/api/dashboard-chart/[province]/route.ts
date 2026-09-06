import { getDashboardChart, getMeta } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getMeta().provinsi.map((province) => ({ province }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ province: string }> }
) {
  const { province } = await params;
  if (!getMeta().provinsi.includes(province)) {
    return Response.json({ error: "Wilayah tidak ditemukan." }, { status: 404 });
  }
  return Response.json({ province, chart: getDashboardChart(province) });
}
