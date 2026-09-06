import { createAuthDev } from "@/lib/auth";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, province } = await req.json();
    const auth = createAuthDev();
    const listRes = await auth.listUsers();
    const user = listRes.users.find((u: { email: string }) => u.email === email);
    if (user) {
      await auth.updateUser({ userId: user.id, data: { province } });
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }
}