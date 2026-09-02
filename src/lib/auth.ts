import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";

// ponytail: singleton per request — upgrade to module-level if edge runtime supports it
export function createAuth(db: D1Database) {
  return betterAuth({
    database: drizzleAdapter(drizzle(db), { provider: "sqlite" }),
    baseURL: process.env.BETTER_AUTH_URL ?? "https://aroma.my.id",
    secret: process.env.BETTER_AUTH_SECRET!,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    emailAndPassword: { enabled: true },
  });
}

export type Auth = ReturnType<typeof createAuth>;
declare global { const D1Database: unknown; }
type D1Database = import("@cloudflare/workers-types").D1Database;
