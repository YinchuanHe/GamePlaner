import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const { email, username } = await request.json();

  if (!email && !username) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  await connect();

  const query = email ? { email } : { username };
  const user = await User.findOne(query).populate({ path: 'clubs', strictPopulate: false });

  if (!user) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email,
    username: user.username,
    role: user.role,
    image: user.image,
    clubs: Array.isArray(user.clubs)
      ? (user.clubs as any[]).map(c => c.name)
      : [],
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const { username, password } = await request.json();

  if (username === undefined && password === undefined) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  await connect();
  const update: any = {};
  if (username !== undefined) update.username = username;
  if (password !== undefined) {
    const hashed = await bcrypt.hash(password, 10);
    update.password = hashed;
  }
  await User.updateOne({ _id: session.user.id }, update);

  if (password !== undefined && session.user.email) {
    const resend = new Resend(process.env.RESEND_API_KEY || '');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset Confirmation</title>
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
                    <h2 style="color:#222; font-size:24px;">Password Reset Successful</h2>
                    <p style="font-size:16px; line-height:1.6; color:#333;">Your password has been updated. If you did not perform this action, please contact support immediately.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td bgcolor="#007bff" style="border-radius:6px; text-align:center;">
                          <a href="${appUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:16px; color:#ffffff; text-decoration:none; border-radius:6px;">
                            Go to PAiMO
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:30px; font-size:12px; color:#888;">
                    You&#8217;re receiving this because your PAiMO password was changed.<br />
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
        to: session.user.email,
        subject: 'Your password was reset',
        html,
      });
    } catch (e) {
      console.error('Failed to send password reset email', e);
    }
  }
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  await connect();
  const user = await User.findOne({ _id: session.user.id }).populate({ path: 'clubs', strictPopulate: false });
  const result = {
    user: {
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
      image: user.image,
      clubs: Array.isArray(user.clubs)
        ? (user.clubs as any[]).map(c => c.name)
        : [],
    }
  };
  return NextResponse.json(result);
}
