// lib/auth.ts
import mongoose from 'mongoose';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { MongoClient } from 'mongodb';

if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.DB_URL!);
}

const mongoClient = new MongoClient(process.env.DB_URL!);
await mongoClient.connect();
const db = mongoClient.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  emailAndPassword: { enabled: true },
  
  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  
  plugins: [nextCookies()],
  
});

export default auth;