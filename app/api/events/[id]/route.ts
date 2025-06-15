import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth';
import connect from '../../../../utils/mongoose';
import Event from '../../../../models/Event';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connect();
  const event = await Event.findById(params.id)
    .populate('participants', 'username')
    .lean();
  if (!event) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  const participants = (event.participants || []).map((p: any) => ({
    id: p._id.toString(),
    username: p.username,
  }));
  return NextResponse.json({
    event: {
      id: event._id.toString(),
      name: event.name,
      status: event.status,
      visibility: event.visibility,
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
  const { name, status, visibility } = await request.json();
  await connect();
  const update: any = {};
  if (name !== undefined) update.name = name;
  if (status !== undefined) update.status = status;
  if (visibility !== undefined) update.visibility = visibility;
  await Event.updateOne({ _id: params.id }, update);
  return NextResponse.json({ success: true });
}
