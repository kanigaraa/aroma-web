import { getServerAuth } from "@/lib/server-auth";
import { type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return (await getServerAuth()).handler(req);
}

export async function POST(req: NextRequest) {
  return (await getServerAuth()).handler(req);
}
