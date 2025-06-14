import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { google } from 'better-auth/social-providers';
import { nextCookies, toNextJsHandler } from 'better-auth/next-js';
import { getClient } from '../utils/db';

let handler: ReturnType<typeof toNextJsHandler> | null = null;

async function getHandler() {
  if (!handler) {
    const client = await getClient();
    const auth = betterAuth({
      adapter: mongodbAdapter(client.db()),
      socialProviders: {
        google:{
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
      plugins: [nextCookies()],
    });
    handler = toNextJsHandler(auth);
  }
  return handler!;
}

export async function getAuthHandler() {
  return getHandler();
}
