import { NextResponse } from 'next/server';
import connect from '@/utils/mongoose';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  await connect();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }
  const pending = await PendingUser.findOne({ email });
  if (pending) {
    await pending.deleteOne();
  }
  const hashed = await bcrypt.hash(password, 10);
  const token = randomBytes(32).toString('hex');
  await PendingUser.create({ email, password: hashed, token });

  const resend = new Resend(process.env.RESEND_API_KEY || '');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error('NEXT_PUBLIC_APP_URL is not set');
  } else {
    try {
      await resend.emails.send({
        from: 'PAiMO <hello@paimo.io>', // Consider replacing no-reply
        to: email,
        subject: '🎉 You’re Almost In! Just Confirm Your Email',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Verify Your Email</title>
            <style>
              body {
                background-color: #f9f9fb;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 20px;
                color: #333;
              }
              .container {
                background-color: #fff;
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                text-align: center;
              }
              img.logo {
                max-width: 180px;
                margin-bottom: 20px;
              }
              h2 {
                color: #2a2a2a;
              }
              .button {
                display: inline-block;
                padding: 14px 28px;
                margin: 20px auto;
                background-color: #007bff;
                color: white;
                font-size: 16px;
                text-decoration: none;
                border-radius: 6px;
              }
              p {
                line-height: 1.6;
              }
              .footer {
                font-size: 12px;
                color: #888;
                margin-top: 40px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="${appUrl}/paimo_logo.png" alt="PAiMO Logo" class="logo" />
              <h2>Let’s Get This Party Started 🎊</h2>
              <p>Hey there! We’re thrilled to have you at <strong>PAiMO</strong>.</p>
              <p>But first things first — hit that big blue button below to confirm your email and unlock the magic ✨.</p>
              <a href="${appUrl}/api/verify-email?token=${token}" class="button">Confirm My Email</a>
              <p>Prefer copy-paste? Here you go:</p>
              <p><a href="${appUrl}/api/verify-email?token=${token}">${appUrl}/api/verify-email?token=${token}</a></p>
              <div class="footer">
                <p>You're receiving this email because you signed up for PAiMO.</p>
                <p>&copy; ${new Date().getFullYear()} PAiMO. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (e) {
      console.error('Failed to send verification email', e);
    }
  }

  return NextResponse.json({ success: true });
}
