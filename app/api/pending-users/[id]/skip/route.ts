import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import connect from '@/utils/mongoose';
import PendingUser from '@/models/PendingUser';
import User from '@/models/User';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'super-admin') {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  await connect();
  const pending = await PendingUser.findById(params.id);
  if (!pending) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  const existing = await User.findOne({ email: pending.email });
  if (!existing) {
    await User.create({ email: pending.email, password: pending.password });
  }
  await pending.deleteOne();
  return NextResponse.json({ success: true });
}
