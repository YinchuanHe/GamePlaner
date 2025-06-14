import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  await connect();
  const user = await User.findOne({ username, password });
  if (user) {
    return NextResponse.json({ success: true, role: user.role });
  }
  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
