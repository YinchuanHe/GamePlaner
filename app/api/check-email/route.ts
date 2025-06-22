import { NextResponse } from 'next/server';
import connect from '@/utils/mongoose';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ exists: false });
  }
  await connect();
  const userExists = await User.exists({ email });
  const tokenExists = await VerificationToken.exists({ email });
  return NextResponse.json({ exists: !!userExists || !!tokenExists });
}
