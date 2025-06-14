import { NextResponse } from 'next/server';
import { getClient } from '../../../utils/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const client = await getClient();
  const db = client.db('gameplaner');
  const existing = await db.collection('users').findOne({ username });
  if (existing) {
    return NextResponse.json({ success: false, error: 'User exists' }, { status: 400 });
  }
  await db.collection('users').insertOne({ username, password });
  return NextResponse.json({ success: true });
}
