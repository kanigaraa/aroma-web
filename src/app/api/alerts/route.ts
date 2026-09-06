import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/server-auth";
import { provinceIdFor } from "@/lib/provinces";

type AlertRow = { id: string; commoditySlug: string; province: string; threshold: number; active: number };

async function userFor(request: Request) {
  try { return await getRequestUser(request); } catch { return null; }
}

export async function GET(request: Request) {
  const user = await userFor(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { env } = getCloudflareContext();
  const result = await (env as CloudflareEnv).DB.prepare(
    "SELECT id, commoditySlug, province, threshold, active FROM price_alert WHERE userId = ? AND active = 1"
  ).bind(user.id).all<AlertRow>();
  return NextResponse.json({ alerts: result.results ?? [] });
}

export async function POST(request: Request) {
  const user = await userFor(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { commoditySlug?: unknown; province?: unknown; threshold?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 }); }
  if (typeof body.commoditySlug !== "string" || !/^[a-z-]{2,40}$/.test(body.commoditySlug) || typeof body.province !== "string" || !provinceIdFor(body.province) || typeof body.threshold !== "number" || !Number.isFinite(body.threshold) || body.threshold <= 0 || body.threshold > 10_000_000) {
    return NextResponse.json({ error: "Data ambang tidak valid." }, { status: 400 });
  }
  const now = Date.now();
  const { env } = getCloudflareContext();
  const id = crypto.randomUUID();
  await (env as CloudflareEnv).DB.prepare(
    "INSERT INTO price_alert (id, userId, commoditySlug, province, threshold, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 1, ?, ?) ON CONFLICT(userId, commoditySlug, province) DO UPDATE SET threshold = excluded.threshold, active = 1, updatedAt = excluded.updatedAt"
  ).bind(id, user.id, body.commoditySlug, body.province, body.threshold, now, now).run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await userFor(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { commoditySlug?: unknown; province?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON tidak valid." }, { status: 400 }); }
  if (typeof body.commoditySlug !== "string" || typeof body.province !== "string") return NextResponse.json({ error: "Data alert tidak valid." }, { status: 400 });
  const { env } = getCloudflareContext();
  await (env as CloudflareEnv).DB.prepare("DELETE FROM price_alert WHERE userId = ? AND commoditySlug = ? AND province = ?").bind(user.id, body.commoditySlug, body.province).run();
  return NextResponse.json({ ok: true });
}
