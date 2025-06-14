import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import Event from '../../../models/Event';
import User from '../../../models/User';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get('clubId');
  await connect();
  const query = clubId ? { club: clubId } : {};
  const events = await Event.find(query, { name: 1 });
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const role = request.headers.get('x-role');
  const username = request.headers.get('x-username');
  const { name, clubId } = await request.json();
  await connect();
  if (role === 'super-admin') {
    await Event.create({ name, club: clubId });
    return NextResponse.json({ success: true });
  }
  if (role === 'admin') {
    const admin = await User.findOne({ username });
    if (admin && admin.club && admin.club.toString() === clubId) {
      await Event.create({ name, club: clubId });
      return NextResponse.json({ success: true });
    }
  }
  return NextResponse.json({ success: false }, { status: 403 });
}
