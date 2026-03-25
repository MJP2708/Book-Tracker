import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
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

          // If DB is unavailable, still allow temporary email auth.
          if (errorCode === "ECONNREFUSED") {
            const fallbackId = `local-${Buffer.from(email).toString("hex").slice(0, 24)}`;
            return { id: fallbackId, email, name: name || email.split("@")[0] };
          }

          // Handle race where another request creates the same email.
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return prisma.user.findUnique({ where: { email } });
          }
          throw error;
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
