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
  const clubs = await Club.find(
    { 'members.id': session.user.id },
    {
      name: 1,
      description: 1,
      location: 1,
      logoUrl: 1,
      createdBy: 1,
      createdAt: 1,
    }
  )
  return NextResponse.json({
    clubs: clubs.map(c => ({
      id: c._id.toString(),
      name: c.name,
      description: c.description,
      location: c.location,
      logoUrl: c.logoUrl,
      createdBy: c.createdBy,
      createdAt: c.createdAt,
    }))
  })
}
