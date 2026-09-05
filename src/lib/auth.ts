import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import { SqliteDialect } from "kysely";
import { authSchema } from "@/lib/auth-schema";

// ponytail: getEnv covers both Node (dev) and Workers (prod) runtimes
function getEnv(key: string): string {
  const v =
    (typeof process !== "undefined" && process.env?.[key]) ||
    (typeof globalThis !== "undefined" && (globalThis as Record<string, unknown>)[key]);
  if (!v) throw new Error(`Missing env: ${key}`);
  return v as string;
}

function otpPlugin() {
  return emailOTP({
    otpLength: 6,
    expiresIn: 300,
    sendVerificationOTP: async ({ email, otp, type }) => {
      const resendKey = getEnv("RESEND_API_KEY");
      const subject =
        type === "email-verification"
          ? "Verifikasi email AROMA"
          : type === "forget-password"
          ? "Reset kata sandi AROMA"
          : "Kode masuk AROMA";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AROMA <noreply@aroma.my.id>",
          to: [email],
          subject,
          html: `<p>Kode OTP kamu: <strong style="font-size:24px;letter-spacing:4px">${otp}</strong></p><p>Berlaku 5 menit.</p>`,
        }),
      });
    },
  });
}

export function createAuth(db: D1Database) {
  return betterAuth({
    database: drizzleAdapter(drizzle(db, { schema: authSchema }), {
      provider: "sqlite",
      schema: authSchema,
    }),
    baseURL: getEnv("BETTER_AUTH_URL"),
    secret: getEnv("BETTER_AUTH_SECRET"),
    trustedOrigins: [
      "https://aroma.my.id",
      "http://localhost:3000",
      "http://127.0.0.1:8787",
    ],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    socialProviders: {
      google: {
        clientId: getEnv("GOOGLE_CLIENT_ID"),
        clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
      },
    },
    plugins: [otpPlugin()],
  });
}

export function createAuthDev() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  const dbFile = new Database(".dev.db");
  return betterAuth({
    database: {
      dialect: new SqliteDialect({ database: dbFile }),
      type: "sqlite",
    },
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-me",
    trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:8787"],
    emailAndPassword: { enabled: true, requireEmailVerification: false },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    plugins: [otpPlugin()],
  });
}

export type Auth = ReturnType<typeof createAuth>;
