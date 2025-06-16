import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth';
import connect from '../../../utils/mongoose';
import User from '../../../models/User';
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const { email, username } = await request.json();

  if (!email && !username) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  await connect();

  const query = email ? { email } : { username };
  const user = await User.findOne(query).populate({ path: 'clubs', strictPopulate: false });

  if (!user) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email,
    username: user.username,
    role: user.role,
    image: user.image,
    clubs: Array.isArray(user.clubs)
      ? (user.clubs as any[]).map(c => c.name)
      : [],
  });
}
