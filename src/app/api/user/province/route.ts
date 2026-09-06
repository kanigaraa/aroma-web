import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { drizzle } from "drizzle-orm/d1";
import { user } from "@/lib/auth-schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(req: NextRequest) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { env } = getCloudflareContext() as { env: CloudflareEnv };
  const db = drizzle(env.DB);
  const row = await db.select().from(user).where(
    // @ts-ignore
    auth.schema.user.id.equals(session.user.id)
  ).limit(1);

  if (!row[0]) return NextResponse.json({ provinceId: null, provinceName: null });
  return NextResponse.json({ provinceId: row[0].provinceId, provinceName: row[0].provinceName });
}