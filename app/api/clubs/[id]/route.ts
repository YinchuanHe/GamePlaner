import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth';
import connect from '../../../../utils/mongoose';
import Club from '../../../../models/Club';
import Event from '../../../../models/Event';
import User from '../../../../models/User';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  await connect();
  const club = await Club.findById(params.id).lean();
  if (!club) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  const memberIds = club.members.map((m: any) => m.id);
  const members = await User.find({ _id: { $in: memberIds } }, { username: 1 })
    .lean();
  const events = await Event.find({ club: params.id }, {
    name: 1,
    status: 1,
    visibility: 1,
    createdAt: 1,
    participants: 1,
  }).lean();
  return NextResponse.json({
    club: {
      id: club._id.toString(),
      name: club.name,
      description: club.description,
      location: club.location,
      logoUrl: club.logoUrl,
      createdBy: club.createdBy,
      createdAt: club.createdAt,
    },
    members: members.map(m => ({ id: m._id.toString(), username: m.username })),
    events: events.map(e => ({
      id: e._id.toString(),
      name: e.name,
      status: e.status,
      visibility: e.visibility,
      createdAt: e.createdAt,
      participantCount: e.participants.length,
    })),
  });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  await connect();
  const club = await Club.findById(params.id);
  if (!club) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  const username = user.username || user.email || 'unknown';
  const already = club.members.some((m: any) => m.id.toString() === user._id.toString());
  if (!already) {
    club.members.push({ id: user._id, username });
    await club.save();
  }
  if (!user.club) {
    user.club = club._id;
    await user.save();
  }
  return NextResponse.json({ success: true });
}
