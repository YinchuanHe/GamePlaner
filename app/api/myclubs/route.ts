import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth'
import connect from '../../../utils/mongoose'
import Club from '../../../models/Club'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ success: false }, { status: 401 })
  }
  await connect()
  const clubs = await Club.find({ 'members.id': session.user.id }, { _id: 0, name: 1 })
  return NextResponse.json({ clubs })
}
