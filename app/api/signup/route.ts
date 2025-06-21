import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';

export async function POST(request: Request) {
  const { email, username, gender, nickname, wechatId } = await request.json();
  await connect();
  const existing = await User.findOne({ email });
  if (existing) {
    await User.updateOne(
      { email },
      { username, gender, nickname, wechatId }
    );
    return NextResponse.json({ success: true, message: 'Profile updated' });
  }
  await User.create({ username, email, gender, nickname, wechatId });
  return NextResponse.json({ success: true });
}
