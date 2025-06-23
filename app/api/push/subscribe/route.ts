import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth';
import connect from '../../../../utils/mongoose';
import User from '../../../../models/User';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const subscription = await request.json();
  await connect();
  await User.updateOne(
    { _id: session.user.id },
    { $addToSet: { pushSubscriptions: subscription } },
  );
  return NextResponse.json({ success: true });
}
