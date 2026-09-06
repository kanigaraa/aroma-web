import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { SqliteDialect } from "kysely";
import { userAdditionalFields } from "@/lib/auth-fields";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
}

export function createAuthDev() {
  const dbFile = new Database(".dev.db");
  return betterAuth({
    database: {
      dialect: new SqliteDialect({ database: dbFile }),
      type: "sqlite",
    },
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-me",
    user: { additionalFields: userAdditionalFields },
    trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:8787"],
    emailAndPassword: { enabled: true, requireEmailVerification: false },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        sendVerificationOTP: async ({ email, otp, type }) => {
          const subject =
            type === "email-verification"
              ? "Verifikasi email AROMA"
              : type === "forget-password"
                ? "Reset kata sandi AROMA"
                : "Kode masuk AROMA";

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getEnv("RESEND_API_KEY")}`,
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
      }),
    ],
  });
}
