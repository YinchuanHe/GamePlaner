import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';

export async function GET(request: Request) {
  const role = request.headers.get('x-role');
  if (role !== 'super-admin') {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  await connect();
  const users = await User.find({}, { _id: 0, username: 1, role: 1 });
  return NextResponse.json({ users });
}

export async function PUT(request: Request) {
  const roleHeader = request.headers.get('x-role');
  const reqUser = request.headers.get('x-username');
  const { username, role } = await request.json();
  await connect();
  if (roleHeader === 'super-admin') {
    await User.updateOne({ username }, { role });
    return NextResponse.json({ success: true });
  }
  if (roleHeader === 'admin') {
    if (role === 'super-admin') {
      return NextResponse.json({ success: false }, { status: 403 });
    }
    const admin = await User.findOne({ username: reqUser });
    if (admin && admin.club) {
      await User.updateOne({ username, club: admin.club }, { role });
      return NextResponse.json({ success: true });
    }
  }
  return NextResponse.json({ success: false }, { status: 403 });
}
