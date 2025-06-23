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
        from: 'PAiMO <hello@paimo.io>',
        to: email,
        subject: '🎉 You’re Almost In! Just Confirm Your Email',
        html: `
          <!DOCTYPE html>
          <html lang="en" style="margin:0;padding:0;">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body, table, td, a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              body {
                margin: 0;
                padding: 0;
                width: 100% !important;
                height: 100% !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f7;
              }
              table {
                border-collapse: collapse !important;
              }
              img {
                border: 0;
                line-height: 100%;
                text-decoration: none;
                max-width: 100%;
                height: auto;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                padding: 30px 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
              }
              .button {
                background-color: #007bff;
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                display: inline-block;
                border-radius: 6px;
                font-size: 16px;
                margin-top: 20px;
              }
              .footer {
                font-size: 12px;
                color: #888888;
                text-align: center;
                margin-top: 40px;
              }
              @media screen and (max-width: 600px) {
                .email-container {
                  width: 100% !important;
                  padding: 20px 10px !important;
                }
                .button {
                  width: 100% !important;
                  text-align: center;
                  display: block;
                  margin-top: 20px;
                }
              }
            </style>
          </head>
          <body>
            <center>
              <div class="email-container">
                <img src="${appUrl}/paimo_logo.png" alt="PAiMO Logo" width="180" style="margin-bottom: 20px;" />
                <h2 style="color: #222;">Let’s Get This Party Started 🎊</h2>
                <p style="font-size: 16px; line-height: 1.5; color: #333;">
                  Hey there! We’re so excited to have you on board at <strong>PAiMO</strong>.
                  <br /><br />
                  Just one more step — tap the button below to confirm your email and dive in!
                </p>
                <a href="${appUrl}/api/verify-email?token=${token}" class="button">Confirm My Email</a>
                <p style="font-size: 14px; color: #555; margin-top: 30px;">
                  If that button doesn’t work, here’s the direct link:
                  <br />
                  <a href="${appUrl}/api/verify-email?token=${token}" style="color: #007bff; word-break: break-all;">
                    ${appUrl}/api/verify-email?token=${token}
                  </a>
                </p>
                <div class="footer">
                  <p>You’re getting this email because you signed up for PAiMO.</p>
                  <p>&copy; ${new Date().getFullYear()} PAiMO. All rights reserved.</p>
                </div>
              </div>
            </center>
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
