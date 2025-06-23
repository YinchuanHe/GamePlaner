import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, username, gender, nickname, wechatId, password } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    await connect()

    const update: any = { username, gender, nickname, wechatId }
    if (password) {
      const hashed = await bcrypt.hash(password, 10)
      update.password = hashed
    }

    const updated = await User.findOneAndUpdate(
      { email },
      { $set: update },
      { new: true, upsert: true }
    )

    return NextResponse.json({ success: true, user: updated })
  } catch (err: any) {
    console.error('Failed to upsert user:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}