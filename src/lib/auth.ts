import { betterAuth } from "better-auth";
import { authSchema } from "@/lib/auth-schema";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

function makeResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function makePlugins() {
  const resend = makeResend();
  return [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subjects: Record<string, string> = {
          "sign-in": "Kode masuk AROMA",
          "email-verification": "Verifikasi email AROMA",
          "forget-password": "Kode reset kata sandi AROMA",
        };
        await resend.emails.send({
          from: "AROMA <noreply@aroma.my.id>",
          to: email,
          subject: subjects[type] ?? "Kode AROMA",
          html: `<p>Kode OTP kamu:</p><h1 style="font-size:40px;letter-spacing:8px;font-family:monospace;color:#0d1b2a">${otp}</h1><p>Berlaku 10 menit.</p>`,
        });
      },
      expiresIn: 600,
    }),
  ];
}

function makeCommon() {
  const resend = makeResend();
  return {
    baseURL: process.env.BETTER_AUTH_URL ?? "https://aroma.my.id",
    secret: process.env.BETTER_AUTH_SECRET!,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }: { user: { name: string; email?: string }; url: string }) => {
        await resend.emails.send({
          from: "AROMA <noreply@aroma.my.id>",
          to: user.email ?? "",
          subject: "Reset kata sandi AROMA",
          html: `<p>Halo ${user.name},</p><p>Klik link berikut untuk mereset kata sandi:</p><a href="${url}" style="background:#0d1b2a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Reset Kata Sandi</a><p>Link berlaku 15 menit.</p>`,
        });
      },
    },
    plugins: makePlugins(),
  };
}

// Production: D1 via Drizzle adapter
export function createAuth(db: D1Database) {
  const { drizzleAdapter } = require("better-auth/adapters/drizzle");
  const { drizzle } = require("drizzle-orm/d1");
  return betterAuth({
    ...makeCommon(),
    database: drizzleAdapter(drizzle(db, { schema: authSchema }), {
      provider: "sqlite",
      schema: authSchema,
    }),
  });
}

// Dev: Kysely + better-sqlite3 local file
export function createAuthDev() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Kysely, SqliteDialect } = require("kysely");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  const db = new Kysely({ dialect: new SqliteDialect({ database: new Database(".dev.db") }) });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return betterAuth({ ...makeCommon(), database: { db, type: "sqlite" } as any });
}

export type Auth = ReturnType<typeof createAuth>;
