import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const name = credentials?.name?.toString().trim();
        const mode = credentials?.mode?.toString() || "login";

        if (!email) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (mode === "signup") {
          if (existingUser) {
            return existingUser;
          }

          const createdUser = await prisma.user.create({
            data: {
              email,
              name: name || email.split("@")[0],
            },
          });

          return createdUser;
        }

        if (!existingUser) {
          return null;
        }

        return existingUser;
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
