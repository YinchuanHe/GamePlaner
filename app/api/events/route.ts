import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import Event from '../../../models/Event';

export async function GET() {
  await connect();
  const events = await Event.find({}, { _id: 0, name: 1 });
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const role = request.headers.get('x-role');
  if (role !== 'super-admin') {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  const { name } = await request.json();
  await connect();
  await Event.create({ name });
  return NextResponse.json({ success: true });
}
