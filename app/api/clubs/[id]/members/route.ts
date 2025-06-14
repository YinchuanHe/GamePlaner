import { NextResponse } from 'next/server';
import connect from '../../../../../utils/mongoose';
import User from '../../../../../models/User';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const role = request.headers.get('x-role');
  const reqUser = request.headers.get('x-username');
  const { username } = await request.json();
  await connect();
  if (role === 'super-admin') {
    await User.updateOne({ username }, { club: params.id });
    return NextResponse.json({ success: true });
  }
  if (role === 'admin') {
    const admin = await User.findOne({ username: reqUser });
    if (admin && admin.club && admin.club.toString() === params.id) {
      await User.updateOne({ username }, { club: params.id });
      return NextResponse.json({ success: true });
    }
  }
  return NextResponse.json({ success: false }, { status: 403 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const role = request.headers.get('x-role');
  const reqUser = request.headers.get('x-username');
  const { username } = await request.json();
  await connect();
  if (role === 'super-admin') {
    await User.updateOne({ username }, { $unset: { club: 1 } });
    return NextResponse.json({ success: true });
  }
  if (role === 'admin') {
    const admin = await User.findOne({ username: reqUser });
    if (admin && admin.club && admin.club.toString() === params.id) {
      await User.updateOne({ username }, { $unset: { club: 1 } });
      return NextResponse.json({ success: true });
    }
  }
  return NextResponse.json({ success: false }, { status: 403 });
}
