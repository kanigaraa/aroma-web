import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { user } from "@/lib/auth-schema";

export async function POST(req: NextRequest) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { provinceId, provinceName } = await req.json();
  if (!provinceId || !provinceName) {
    return NextResponse.json({ error: "provinceId and provinceName required" }, { status: 400 });
  }

  // update via drizzle directly — get D1 from auth's internal adapter
  const adapter = (auth as unknown as { adapter: { db: { client: { wrangler: unknown } } } }).adapter;
  // use better-auth's updateUser plugin
  await auth.api.updateUser({
    headers: req.headers,
    body: { name: session.user.name, email: session.user.email, image: session.user.image, emailVerified: true },
  }).catch(() => {});
  // direct D1 update via Cloudflare env
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = getCloudflareContext() as { env: CloudflareEnv };
  const { drizzle } = await import("drizzle-orm/d1");
  await drizzle(env.DB).update(user).set({ provinceId, provinceName }).where(eq(user.id, session.user.id));

  return NextResponse.json({ ok: true });
}