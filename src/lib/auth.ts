import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import type { D1Database } from "@cloudflare/workers-types";

export type AuthEnv = {
  DB: D1Database;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
};

function makeResend(apiKey: string) {
  return new Resend(apiKey);
}

function makePlugins(env: AuthEnv) {
  const resend = makeResend(env.RESEND_API_KEY);
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

function makeCommon(env: AuthEnv) {
  const resend = makeResend(env.RESEND_API_KEY);
  return {
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
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
    plugins: makePlugins(env),
  };
}

export function createAuth(env: AuthEnv) {
  return betterAuth({
    ...makeCommon(env),
    database: env.DB,
  });
}

export type Auth = ReturnType<typeof createAuth>;
