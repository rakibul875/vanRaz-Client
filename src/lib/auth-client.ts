// lib/auth-client.ts

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(), // Automatically attaches role to session.user
  ],
  baseURL: process.env.BETTER_AUTH_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
