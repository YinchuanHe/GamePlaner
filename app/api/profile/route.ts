import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';
import Club from '../../../models/Club';

export async function GET(request: Request) {
  const username = request.headers.get('x-username');
  if (!username) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  await connect();
  const user = await User.findOne({ username }).populate({ path: 'club', strictPopulate: false });
  if (!user) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  return NextResponse.json({
    username: user.username,
    role: user.role,
    club: user.club ? (user.club as any).name : null,
  });
}
