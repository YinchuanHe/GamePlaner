import { NextResponse } from 'next/server';
import connect from '@/utils/mongoose';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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

  const hashed = await bcrypt.hash(password, 10);

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await VerificationToken.findOneAndDelete({ email });
  await VerificationToken.create({ email, password: hashed, token, expiresAt });

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const verifyUrl = `${process.env.BASE_URL}/api/verify?token=${token}`;
  await resend.emails.send({
    from: 'no-reply@piv-club',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
  });

  return NextResponse.json({ success: true });
}
