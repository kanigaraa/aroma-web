import { createAuth, createAuthDev } from "@/lib/auth";
import { type NextRequest } from "next/server";

export const runtime = "nodejs";

function getAuth() {
  const db = (process.env as Record<string, unknown>).DB;
  if (db) return createAuth(db as import("@cloudflare/workers-types").D1Database);
  return createAuthDev();
}

export async function GET(req: NextRequest) {
  return getAuth().handler(req);
}

export async function POST(req: NextRequest) {
  return getAuth().handler(req);
}
