import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import connect from "@/utils/mongoose";
import User from "@/models/User";
import clientPromise from "@/lib/mongodb";
import { Resend } from "resend";

// Extend session types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      clubs?: string[];
      profileComplete?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
    clubs?: string[];
    profileComplete?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  debug: true,
  secret: process.env.AUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    newUser: '/create-profile', // redirect after first sign-in (email/Google)
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connect();
        const user = await User.findOne({ email: credentials.email });
        if (!user?.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          image: user.image,
          role: user.role,
          clubs: user.clubs,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        const resend = new Resend(process.env.RESEND_API_KEY || '');
        const { host } = new URL(url);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'PAiMO <hello@paimo.io>',
          to: identifier,
          subject: `Sign in to ${host}`,
          html: `<p>Sign in by clicking <a href="${url}">here</a>.</p>`,
        });
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Let adapter handle user creation, just allow sign-in
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? null;
        token.clubs = (user as any).clubs ?? [];
        token.profileComplete = Boolean((user as any).username);
      }

      if (!token.email) return token;

      await connect();
      const dbUser = await User.findOne({ email: token.email });
      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role ?? null;
        token.clubs = dbUser.clubs?.map((c: any) => c.toString()) ?? [];
        token.profileComplete = Boolean(dbUser.username);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id ?? undefined;
        session.user.role = token.role ?? null;
        session.user.clubs = token.clubs ?? [];
        session.user.profileComplete = token.profileComplete ?? false;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/create-profile`; // always redirect after login
    },
  },
};

export default NextAuth(authOptions);