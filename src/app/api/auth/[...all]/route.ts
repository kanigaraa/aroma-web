import { createAuth } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { type NextRequest } from "next/server";

export const runtime = "nodejs";

async function getAuth() {
  if (process.env.NODE_ENV === "development") {
    const { createAuthDev } = await import("@/lib/auth-dev");
    return createAuthDev();
  }
  const { env } = getCloudflareContext();
  return createAuth((env as CloudflareEnv).DB);
}

export async function GET(req: NextRequest) {
  return (await getAuth()).handler(req);
}

export async function POST(req: NextRequest) {
  return (await getAuth()).handler(req);
}
