import { createAuthDev } from "@/lib/auth";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const auth = createAuthDev();
    // Server-side session check
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { province } = await req.json();
    await auth.updateUser({ userId: session.user.id, data: { province } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }
}