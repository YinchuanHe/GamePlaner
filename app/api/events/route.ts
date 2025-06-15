import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth';
import connect from '../../../utils/mongoose';
import Event from '../../../models/Event';

export async function GET() {
  await connect();
  const events = await Event.find({}, {
    name: 1,
    club: 1,
    status: 1,
    visibility: 1,
    createdAt: 1,
    participants: 1,
  });
  return NextResponse.json({
    events: events.map(e => ({
      id: e._id.toString(),
      name: e.name,
      club: e.club?.toString() || null,
      status: e.status,
      visibility: e.visibility,
      createdAt: e.createdAt,
      participantCount: e.participants.length,
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
  const { name, clubId, status, visibility } = await request.json();
  await connect();
  await Event.create({ name, club: clubId, status, visibility });
  return NextResponse.json({ success: true });
}
