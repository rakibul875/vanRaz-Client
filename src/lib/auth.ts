import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(
  process.env.MONGODB_URL || "mongodb://localhost:27017",
);

const db = client.db(process.env.MONGODB_DATABASE || "venraz");

const ADMIN_EMAIL = "fhlimon360@gmail.com";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: (process.env.GOOGLE_CLIENT_ID as string) || "",
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string) || "",
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"], // add trusted providers
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
      },
    },
  },

  // Database hooks for role assignment and syncing guest orders
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const isAdmin =
            user.email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

          return {
            data: {
              ...user,
              role: isAdmin ? "admin" : "user",
            },
          };
        },
        after: async (user) => {
          if (user?.email) {
            try {
              await db
                .collection("orders")
                .updateMany(
                  { guestEmail: user.email.toLowerCase(), user: null },
                  { $set: { user: user.id } },
                );
            } catch (error) {
              console.error("Error syncing guest orders:", error);
            }
          }
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        issuer: "venraz",
        audience: "venraz",
        expirationTime: "15m",
      },
    }),
  ],
});
