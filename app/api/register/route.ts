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
        from: 'no-reply@example.com',
        to: email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${appUrl}/api/verify-email?token=${token}">here</a> to verify your email.</p>`,
      });
    } catch (e) {
      console.error('Failed to send verification email', e);
    }
  }

  return NextResponse.json({ success: true });
}
