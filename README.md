This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Before accessing the main scheduler you need an account. Visit `/signup` to create one and then log in at `/login`.
Super admins can manage user roles at `/manage`.

### Security & roles

API routes and pages are protected with NextAuth middleware. The session stores each user's role so that middleware and server handlers can enforce access rules. The profile API requires authentication and accepts a POST body with the user's `email` or `username`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Local Environment Setup

1. Create a `.env.local` file in the root of the project.
2. Inside that file, define the `DB_URL` variable with your MongoDB connection string and a `NEXTAUTH_SECRET` used by NextAuth:

   ```env
   DB_URL=your_mongodb_connection_string
   NEXTAUTH_SECRET=some_complex_secret
   ```

3. Run the development server with `npm run dev`.

This `.env.local` file is ignored by git and should not be committed.
