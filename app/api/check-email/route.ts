import { NextResponse } from 'next/server';
import connect from '@/utils/mongoose';
import User from '@/models/User';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ exists: false });
  }
  await connect();
  const exists = await User.exists({ email });
  return NextResponse.json({ exists: !!exists });
}
