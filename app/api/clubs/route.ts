import { NextResponse } from 'next/server';
import connect from '../../../utils/mongoose';
import Club from '../../../models/Club';

export async function GET() {
  await connect();
  const clubs = await Club.find({}, { name: 1 });
  return NextResponse.json({ clubs });
}

export async function POST(request: Request) {
  const role = request.headers.get('x-role');
  if (role !== 'super-admin') {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  const { name } = await request.json();
  await connect();
  await Club.create({ name });
  return NextResponse.json({ success: true });
}
