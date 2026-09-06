import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { user } from "@/lib/auth-schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(req: NextRequest) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ provinceId: null, provinceName: null });

  // dev: sqlite, prod: D1
  if (process.env.NODE_ENV === "development") {
    const { default: Database } = await import("better-sqlite3");
    const { drizzle: drizzleSqlite } = await import("drizzle-orm/better-sqlite3");
    const sqlite = new Database(".dev.db");
    const db = drizzleSqlite(sqlite);
    const row = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);
    return NextResponse.json({ provinceId: row[0]?.provinceId ?? null, provinceName: row[0]?.provinceName ?? null });
  }

  const { env } = getCloudflareContext() as { env: CloudflareEnv };
  const db = drizzle(env.DB);
  const row = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);
  return NextResponse.json({ provinceId: row[0]?.provinceId ?? null, provinceName: row[0]?.provinceName ?? null });
}

export async function POST(req: NextRequest) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { provinceId, provinceName } = await req.json();
  if (!provinceId || !provinceName) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  if (process.env.NODE_ENV === "development") {
    const { default: Database } = await import("better-sqlite3");
    const { drizzle: drizzleSqlite } = await import("drizzle-orm/better-sqlite3");
    const sqlite = new Database(".dev.db");
    const db = drizzleSqlite(sqlite);
    await db.update(user).set({ provinceId, provinceName }).where(eq(user.id, session.user.id));
    return NextResponse.json({ ok: true });
  }

  const { env } = getCloudflareContext() as { env: CloudflareEnv };
  const db = drizzle(env.DB);
  await db.update(user).set({ provinceId, provinceName }).where(eq(user.id, session.user.id));
  return NextResponse.json({ ok: true });
}
