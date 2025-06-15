import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import connect from "@/utils/mongoose";
import User from "@/models/User";

// Extend the default session user type to include id and role
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      club?: string | null;
    };
  }
}

// Extend JWT to carry the user role
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
    club?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        token.id = dbUser!._id.toString();
        token.role = dbUser?.role || null
        token.club = dbUser?.club ? dbUser.club.toString() : null
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) session.user.id = token.id as string
      if (session.user) {
        session.user.id = token.id;
        session.user.role = (token.role as string) || null;
        session.user.club = (token.club as string) || null;
      }
      return session
    },
    async signIn({ user }) {
      await connect();
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        return true;
      } else {
        // If user does not exist, create a new user
        await User.create({
          email: user.email,
          image: user.image,
        });
      }
      // Redirect new users to create-profile
      return "/create-profile";
    },
    async redirect({ url, baseUrl }) {
      // If redirecting to create-profile, allow it
      if (url.startsWith(`${baseUrl}/create-profile`)) {
        return url;
      }
      // Otherwise, send to /user
      return `${baseUrl}/user`;
    },
  },
}

export default NextAuth(authOptions)
