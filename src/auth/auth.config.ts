import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AuthConfig } from "@auth/core";
import prisma from "../config/prisma";
import { providers } from "./auth.providers";

export const authConfig: AuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET!,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        if (!token.sub) throw new Error("Missing token.sub");
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
