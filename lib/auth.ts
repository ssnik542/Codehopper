import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { polarClient } from "@/module/payment/config/polar";
import {
  updatePolarCustomerId,
  updateUserTier,
} from "@/module/payment/lib/subscription";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scopes: ["repo"],
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://unsteeped-cortney-nonadapting.ngrok-free.dev",
  ],
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "5c8f313b-56fe-4db0-8aab-17f2869d8006",
              slug: "codehopper",
            },
          ],
          successUrl:
            process.env.POLAR_SUCCESS_URL || "/dashboard/billing?success=true",
          authenticatedUsersOnly: true,
        }),
        portal({
          returnUrl:
            process.env.NEXT_PUBLIC_APP_URL ||
            "http://localhost:3000/dashboard",
        }),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionActive: async (payload) => {
            const customerId = payload.data.customerId;
            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (user) {
              await updateUserTier(user.id, "PRO", "ACTIVE", payload.data.id);
            }
          },
          onSubscriptionCanceled: async (payload) => {
            const customerId = payload.data.customerId;
            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (user) {
              await updateUserTier(
                user.id,
                "PRO",
                user.subscriptionTier as any,
                "CANCELED"
              );
            }
          },
          onSubscriptionRevoked: async (payload) => {
            const customerId = payload.data.customerId;
            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (user) {
              await updateUserTier(user.id, "FREE", "EXPIRED");
            }
          },
          onOrderPaid: async () => {},
          onCustomerCreated: async (payload) => {
            const user = await prisma.user.findUnique({
              where: {
                email: payload.data.email,
              },
            });

            if (user) {
              await updatePolarCustomerId(user.id, payload.data.id);
            }
          },
        }),
      ],
    }),
  ],
});
