import { NextResponse } from 'next/server';
import { getClient } from '../../../utils/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const client = await getClient();
  const user = await client.db('gameplaner').collection('users').findOne({ username, password });
  if (user) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
