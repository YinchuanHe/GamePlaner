import { NextResponse } from 'next/server';
import connect from '../../../../utils/mongoose';
import Club from '../../../../models/Club';
import User from '../../../../models/User';
import Event from '../../../../models/Event';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connect();
  const club = await Club.findById(params.id);
  if (!club) return NextResponse.json({ success: false }, { status: 404 });
  const members = await User.find({ club: params.id }, { _id: 0, username: 1 });
  const events = await Event.find({ club: params.id }, { _id: 0, name: 1 });
  return NextResponse.json({
    id: club._id,
    name: club.name,
    members: members.map(m => m.username),
    events: events.map(e => e.name),
  });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const role = request.headers.get('x-role');
  const username = request.headers.get('x-username');
  const { name } = await request.json();
  await connect();
  if (role === 'super-admin') {
    await Club.updateOne({ _id: params.id }, { name });
    return NextResponse.json({ success: true });
  }
  if (role === 'admin') {
    const admin = await User.findOne({ username });
    if (admin && admin.club && admin.club.toString() === params.id) {
      await Club.updateOne({ _id: params.id }, { name });
      return NextResponse.json({ success: true });
    }
  }
  return NextResponse.json({ success: false }, { status: 403 });
}
