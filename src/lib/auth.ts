import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";

export function createAuth(db: CloudflareD1Database) {
  const drizzleDb = drizzle(db);
  return betterAuth({
    database: drizzleAdapter(drizzleDb, { provider: "sqlite" }),
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

// ponytail: D1 type from wrangler runtime — upgrade to typed schema when migrations added
type CloudflareD1Database = import("@cloudflare/workers-types").D1Database;
