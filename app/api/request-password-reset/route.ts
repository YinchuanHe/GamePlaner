import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import connect from '@/utils/mongoose';
import PasswordReset from '@/models/PasswordReset';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  let email = session?.user.email;
  if (!email) {
    try {
      const data = await request.json();
      email = data.email;
    } catch {
      email = undefined;
    }
  }
  if (!email) {
    return NextResponse.json(
      { success: false, message: 'Email is required' },
      { status: 400 }
    );
  }
  await connect();

  await PasswordReset.deleteMany({ email });
  const token = randomBytes(32).toString('hex');
  await PasswordReset.create({ email, token });

  const resend = new Resend(process.env.RESEND_API_KEY || '');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Segoe UI, Tahoma, sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f7;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:0 auto; background:#ffffff; padding:30px 20px; border-radius:10px;">
                <tr>
                  <td align="center">
                    <img src="${appUrl}/paimo_logo.png" alt="PAiMO Logo" width="160" style="margin-bottom:20px;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 20px;">
                    <h2 style="color:#222; font-size:24px;">Reset Your Password</h2>
                    <p style="font-size:16px; line-height:1.6; color:#333;">Click the button below to set a new password for your PAiMO account.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td bgcolor="#007bff" style="border-radius:6px; text-align:center;">
                          <a href="${appUrl}/reset-password?token=${token}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:16px; color:#ffffff; text-decoration:none; border-radius:6px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px;">
                    <p style="font-size:14px; color:#555;">If that button doesn’t work, copy and paste this link into your browser:</p>
                    <p style="word-break:break-all; font-size:14px; color:#007bff;">
                      <a href="${appUrl}/reset-password?token=${token}" style="color:#007bff; text-decoration:none;">
                        ${appUrl}/reset-password?token=${token}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:30px; font-size:12px; color:#888;">
                    You’re receiving this because you requested a password reset for PAiMO.<br />
                    &copy; ${new Date().getFullYear()} PAiMO. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    try {
      await resend.emails.send({
        from: 'PAiMO <hello@paimo.io>',
        to: email,
        subject: 'Reset your PAiMO password',
        html,
      });
    } catch (e) {
      console.error('Failed to send reset email', e);
    }
  }

  return NextResponse.json({ success: true });
}
