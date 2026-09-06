import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createAuth } from "@/lib/auth";

export async function getServerAuth() {
  if (process.env.NODE_ENV === "development") {
    const { createAuthDev } = await import("@/lib/auth-dev");
    return createAuthDev();
  }
  const { env } = getCloudflareContext();
  return createAuth((env as CloudflareEnv).DB);
}

export async function getRequestUser(request: Request) {
  const auth = await getServerAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}
