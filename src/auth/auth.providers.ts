import CredentialsProvider from "@auth/core/providers/credentials";
import GoogleProvider from "@auth/core/providers/google";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

export const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),

  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (
        !credentials ||
        typeof credentials.email !== "string" ||
        typeof credentials.password !== "string"
      ) {
        throw new Error("Missing or invalid credentials");
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user || !user.password) {
        throw new Error("Invalid credentials");
      }

      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      return user;
    },
  }),
];
