# PAiMO for 🏸

Welcome to the PIV Club's not-so-serious game scheduler. It's a Next.js app with NextAuth sprinkled on top so you can manage who gets to do what.

## Dangerously Quick Setup
1. Clone this repo and run `npm install`. (Skip this and things will break, we warned you!)
2. Drop a `.env.local` file at the project root with your `DB_URL`, `AUTH_SECRET`, `RESEND_API_KEY` and `BASE_URL`:
   ```env
   DB_URL=your_mongodb_connection_string
   AUTH_SECRET=some_complex_secret
   RESEND_API_KEY=your_resend_key
   BASE_URL=http://localhost:3000
   ```
3. Fire up the dev server with `npm run dev` and open `http://localhost:3000`.
4. Head to `/signup` to create an account. You'll receive a verification email.
5. Click the link in that email to verify and continue creating your profile.

That's it. Short, sweet, and probably unstable—handle with care!

