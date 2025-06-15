import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth';
import connect from '../../../utils/mongoose';
import Club from '../../../models/Club';
import User from '../../../models/User';

export async function GET() {
  await connect();
  const clubs = await Club.find({}, { _id: 0, name: 1 });
  return NextResponse.json({ clubs });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'super-admin') {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  const { name } = await request.json();
  await connect();
  const user = await User.findById(session.user.id);
  const username = user?.username || user?.email || 'unknown';
  const club = await Club.create({
    name,
    members: [{ id: user._id, username }],
  });
  // also store the club reference on user for convenience
  if (user) {
    user.club = club._id;
    await user.save();
  }
  return NextResponse.json({ success: true });
}
