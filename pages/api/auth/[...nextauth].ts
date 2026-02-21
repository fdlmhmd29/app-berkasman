import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. Cari user di Neon database via Drizzle
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email));

        const user = userResult[0];

        if (!user || !user.password) return null;

        // 2. Verifikasi password dengan bcrypt
        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) return null;

        // 3. Kembalikan data user untuk dimasukkan ke JWT token
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "Reviewer", // Pastikan role terbawa
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Sesi bertahan 30 hari
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Arahkan ke halaman login custom
  },
};

export default NextAuth(authOptions);
