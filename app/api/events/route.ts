import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth';
import connect from '../../../utils/mongoose';
import Event from '../../../models/Event';
import Club from '../../../models/Club';
import User from '../../../models/User';
import { sendPush } from '../../../utils/push';
import mongoose from 'mongoose';

export async function GET() {
  const session = await getServerSession(authOptions);
  await connect();

  let query: any = {};
  if (!session) {
    query.visibility = { $ne: 'private' };
  } else if (session.user?.role !== 'super-admin') {
    const clubIds = (session.user.clubs || []).map(id =>
      new mongoose.Types.ObjectId(id)
    );
    query = {
      $or: [{ visibility: { $ne: 'private' } }, { club: { $in: clubIds } }],
    };
  }

  const events = await Event.find(query, {
    name: 1,
    club: 1,
    status: 1,
    visibility: 1,
    registrationEndTime: 1,
    location: 1,
    gameStyle: 1,
    maxPoint: 1,
    courtCount: 1,
    createdAt: 1,
    participants: 1,
  }).populate('club', 'name');

  return NextResponse.json({
    events: events.map(e => ({
      id: e._id.toString(),
      name: e.name,
      club: e.club?._id ? e.club._id.toString() : null,
      clubName: (e as any).club?.name || null,
      status: e.status,
      visibility: e.visibility,
      registrationEndTime: e.registrationEndTime,
      location: e.location,
      gameStyle: e.gameStyle,
      maxPoint: e.maxPoint,
      courtCount: e.courtCount,
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
  const {
    name,
    clubId,
    status,
    visibility,
    registrationEndTime,
    location,
    gameStyle,
    maxPoint,
    courtCount,
    umpires,
  } = await request.json();
  await connect();
  const event = await Event.create({
    name,
    club: clubId,
    status,
    visibility,
    registrationEndTime,
    location,
    gameStyle,
    maxPoint,
    courtCount,
    umpires,
  });

  if (clubId) {
    const club: any = await Club.findById(clubId);
    if (club) {
      const memberIds = (club.members || []).map((m: any) => m.id);
      const users = await User.find(
        { _id: { $in: memberIds } },
        'pushSubscriptions',
      );
      for (const u of users) {
        for (const sub of u.pushSubscriptions || []) {
          await sendPush(sub, {
            title: 'New Event Created',
            body: `${name} has been created in ${club.name}`,
            eventId: event._id.toString(),
          });
        }
      }
    }
  }
  return NextResponse.json({ success: true });
}
