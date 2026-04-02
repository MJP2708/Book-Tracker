import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyDemoAuthUser } from "@/lib/demo-auth";

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET;
const hasGoogle = Boolean(googleClientId && googleClientSecret);

const providers = [
  ...(hasGoogle
    ? [
        Google({
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
        }),
      ]
    : []),
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toString().trim().toLowerCase();
      const name = credentials?.name?.toString().trim();
      const password = credentials?.password?.toString() || "";

      if (!email) {
        return null;
      }

      // Password path first: demo-mode local auth store.
      if (password) {
        const valid = await verifyDemoAuthUser(email, password);
        if (!valid) return null;
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          if (name && existingUser.name !== name) {
            return prisma.user.update({
              where: { id: existingUser.id },
              data: { name },
            });
          }
          return existingUser;
        }

        return await prisma.user.create({
          data: {
            email,
            name: name || email.split("@")[0],
          },
        });
      } catch (error) {
        const errorCode = typeof error === "object" && error && "code" in error ? String(error.code) : "";

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          return prisma.user.findUnique({ where: { email } });
        }

        console.warn("Credentials authorize fallback:", errorCode || "unknown");
        const fallbackId = `local-${email.replace(/[^a-z0-9]/g, "").slice(0, 24) || "user"}`;
        return { id: fallbackId, email, name: name || email.split("@")[0] };
      }
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "temporary-local-auth-secret",
  trustHost: true,
  providers,
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
