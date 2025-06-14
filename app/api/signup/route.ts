import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  await connect();
  const existing = await User.findOne({ username });
  if (existing) {
    return NextResponse.json({ success: false, error: 'User exists' }, { status: 400 });
  }
  await User.create({ username, password });
  return NextResponse.json({ success: true });
}
