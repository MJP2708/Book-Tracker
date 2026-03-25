import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "temporary-local-auth-secret",
  trustHost: true,
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const name = credentials?.name?.toString().trim();

        if (!email) {
          return null;
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

          // Handle race where another request creates the same email.
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return prisma.user.findUnique({ where: { email } });
          }

          // Temporary no-Google mode: if DB/auth storage fails, still allow session auth.
          console.warn("Credentials authorize fallback:", errorCode || "unknown");
          const fallbackId = `local-${email.replace(/[^a-z0-9]/g, "").slice(0, 24) || "user"}`;
          return { id: fallbackId, email, name: name || email.split("@")[0] };
        }
      },
    }),
  ],
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
