import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/server-auth";
import { provinceIdFor } from "@/lib/provinces";

export async function POST(request: Request) {
  let user;
  try { user = await getRequestUser(request); } catch { user = null; }
  if (!user) return NextResponse.json({ error: "Sesi tidak valid. Silakan masuk kembali." }, { status: 401 });
  let body: { name?: unknown; province?: unknown; notifications?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 }); }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const province = typeof body.province === "string" ? body.province : "";
  const provinceId = provinceIdFor(province);
  if (!name || name.length > 100 || !provinceId || typeof body.notifications !== "boolean") {
    return NextResponse.json({ error: "Data profil atau wilayah tidak valid." }, { status: 400 });
  }
  const { env } = getCloudflareContext();
  await (env as CloudflareEnv).DB.prepare(
    "UPDATE user SET name = ?, region = ?, provinceName = ?, provinceId = ?, notifications = ?, updatedAt = ? WHERE id = ?"
  ).bind(name, province, province, provinceId, body.notifications ? 1 : 0, Date.now(), user.id).run();
  return NextResponse.json({ ok: true });
}
