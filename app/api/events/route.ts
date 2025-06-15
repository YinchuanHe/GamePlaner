import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth';
import connect from '../../../utils/mongoose';
import Event from '../../../models/Event';

export async function GET() {
  await connect();
  const events = await Event.find({}, { name: 1, club: 1 });
  return NextResponse.json({
    events: events.map(e => ({
      id: e._id.toString(),
      name: e.name,
      club: e.club?.toString() || null,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !(
      session.user?.role === 'super-admin' || session.user?.role === 'admin'
    )
  ) {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  const { name, clubId } = await request.json();
  await connect();
  await Event.create({ name, club: clubId });
  return NextResponse.json({ success: true });
}
