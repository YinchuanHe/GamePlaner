import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth';
import connect from '../../../../utils/mongoose';
import Event from '../../../../models/Event';
import Club from '../../../../models/Club';
import User from '../../../../models/User';
import { sendPush } from '../../../../utils/push';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connect();
  const event: any = await Event.findById(params.id)
    .populate('participants', 'username image')
    .populate('club', 'name')
    .lean();
  if (!event) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  const participants = (event.participants || []).map((p: any) => ({
    id: p._id.toString(),
    username: p.username,
    image: p.image || null,
  }));
  return NextResponse.json({
    event: {
      id: event._id.toString(),
      name: event.name,
      status: event.status,
      visibility: event.visibility,
      registrationEndTime: event.registrationEndTime,
      location: event.location,
      gameStyle: event.gameStyle,
      maxPoint: event.maxPoint,
      courtCount: event.courtCount,
      umpires: event.umpires,
      club: event.club?._id ? event.club._id.toString() : null,
      clubName: event.club?.name || null,
      createdAt: event.createdAt,
      participants,
    },
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
  const event = await Event.findById(params.id);
  if (!event) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  const canRegister =
    event.status === 'registration' &&
    (!event.registrationEndTime || event.registrationEndTime > new Date()) &&
    (
      event.visibility === 'public-join' ||
      (event.club && session.user.clubs && session.user.clubs.includes(event.club.toString())) ||
      session.user.role === 'admin' ||
      session.user.role === 'super-admin'
    );
  if (!canRegister) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  const userId = session.user.id;
  if (!event.participants.some((p: any) => p.toString() === userId)) {
    event.participants.push(userId);
    await event.save();
  }
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session ||
    !(session.user?.role === 'super-admin' || session.user?.role === 'admin')) {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  const {
    name,
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
  const event = await Event.findById(params.id);
  if (!event) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  const update: any = {};
  if (name !== undefined) update.name = name;
  if (status !== undefined) update.status = status;
  if (visibility !== undefined) update.visibility = visibility;
  if (registrationEndTime !== undefined) update.registrationEndTime = registrationEndTime;
  if (location !== undefined) update.location = location;
  if (gameStyle !== undefined) update.gameStyle = gameStyle;
  if (maxPoint !== undefined) update.maxPoint = maxPoint;
  if (courtCount !== undefined) update.courtCount = courtCount;
  if (umpires !== undefined) update.umpires = umpires;

  await Event.updateOne({ _id: params.id }, update);

  if (status && event.status !== status && status === 'registration') {
    if (event.club) {
      const club: any = await Club.findById(event.club);
      const memberIds = (club?.members || []).map((m: any) => m.id);
      const users = await User.find(
        { _id: { $in: memberIds } },
        'pushSubscriptions',
      );
      for (const u of users) {
        for (const sub of u.pushSubscriptions || []) {
          await sendPush(sub, {
            title: 'Event Registration Open',
            body: `${event.name} is now open for registration`,
            eventId: event._id.toString(),
          });
        }
      }
    }
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !(session.user?.role === 'super-admin' || session.user?.role === 'admin')
  ) {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  const url = new URL(request.url);
  const participantId = url.searchParams.get('participantId');
  if (!participantId) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  await connect();
  await Event.updateOne(
    { _id: params.id },
    { $pull: { participants: participantId } }
  );
  return NextResponse.json({ success: true });
}
