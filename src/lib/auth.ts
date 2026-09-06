import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import { authSchema } from "@/lib/auth-schema";
import { userAdditionalFields } from "@/lib/auth-fields";

const userOptions = { additionalFields: userAdditionalFields };

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
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AROMA <support@aroma.my.id>",
          to: [email],
          subject,
          html: `<p>Kode OTP kamu: <strong style="font-size:24px;letter-spacing:4px">${otp}</strong></p><p>Berlaku 5 menit.</p>`,
        }),
      });
      if (!response.ok) {
        throw new Error(`Resend failed ${response.status}: ${await response.text()}`);
      }
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
    user: userOptions,
    trustedOrigins: [
      "https://aroma.my.id",
      "http://localhost:3000",
      "http://127.0.0.1:8787",
    ],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getEnv("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "AROMA <support@aroma.my.id>",
            to: [user.email],
            subject: "Reset kata sandi AROMA",
            html: `<p>Klik tautan berikut untuk reset kata sandi kamu:</p><p><a href="${url}" style="color:#0d9488;font-weight:600">Reset Kata Sandi</a></p><p>Tautan berlaku 1 jam. Abaikan jika tidak merasa meminta reset.</p>`,
          }),
        });
        if (!response.ok) {
          throw new Error(`Resend failed ${response.status}: ${await response.text()}`);
        }
      },
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

export type Auth = ReturnType<typeof createAuth>;
