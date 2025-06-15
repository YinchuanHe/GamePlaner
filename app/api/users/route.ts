import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'super-admin') {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  await connect();
  const users = await User.find({}, { _id: 0, username: 1, role: 1 });
  return NextResponse.json({ users });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'super-admin') {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  const { username, role } = await request.json();
  await connect();
  await User.updateOne({ username }, { role });
  return NextResponse.json({ success: true });
}
