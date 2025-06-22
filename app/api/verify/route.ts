import { NextResponse } from 'next/server';
import connect from '@/utils/mongoose';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(`${process.env.BASE_URL}/login`);
  }
  await connect();
  const record = await VerificationToken.findOne({ token, expiresAt: { $gt: new Date() } });
  if (!record) {
    return NextResponse.redirect(`${process.env.BASE_URL}/login`);
  }

  const { email, password } = record as { email: string; password: string };
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ email, password });
  }
  await VerificationToken.deleteOne({ _id: record._id });

  return NextResponse.redirect(`${process.env.BASE_URL}/create-profile?email=${encodeURIComponent(email)}`);
}
