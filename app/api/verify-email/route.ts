import { NextResponse } from 'next/server';
import connect from '@/utils/mongoose';
import PendingUser from '@/models/PendingUser';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
  await connect();
  const pending = await PendingUser.findOne({ token });
  if (!pending) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
  const { email } = pending;
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/create-profile?email=${encodeURIComponent(email)}&token=${token}`
  );
}
