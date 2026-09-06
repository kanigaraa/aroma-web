import { env } from "cloudflare:workers";
import { createAuth } from "@/lib/auth";
import { type NextRequest } from "next/server";

const auth = createAuth(env);

export async function GET(req: NextRequest) {
  return auth.handler(req);
}

export async function POST(req: NextRequest) {
  return auth.handler(req);
}
