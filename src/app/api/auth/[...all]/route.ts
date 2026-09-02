import { createAuth } from "@/lib/auth";
import { type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = createAuth(getDB());
  return auth.handler(req);
}

export async function POST(req: NextRequest) {
  const auth = createAuth(getDB());
  return auth.handler(req);
}

function getDB() {
  // CF Pages injects D1 via process.env in nodejs runtime
  const db = (process.env as Record<string, unknown>).DB;
  if (!db) throw new Error("DB binding missing");
  return db as import("@cloudflare/workers-types").D1Database;
}
