import { createAuth, createAuthDev } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { type NextRequest } from "next/server";

export const runtime = "nodejs";

function getAuth() {
  if (process.env.NODE_ENV === "development") return createAuthDev();
  const { env } = getCloudflareContext();
  return createAuth((env as CloudflareEnv).DB);
}

export async function GET(req: NextRequest) {
  return getAuth().handler(req);
}

export async function POST(req: NextRequest) {
  return getAuth().handler(req);
}
