import { createAuthClient } from "better-auth/react";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { userAdditionalFields } from "@/lib/auth-fields";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "https://aroma.my.id",
  plugins: [emailOTPClient(), inferAdditionalFields({ user: userAdditionalFields })],
});

export const { signIn, signUp, signOut, useSession } = authClient;
