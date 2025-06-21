'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import EventCard from '../components/EventCard'
import ClubCard from '../components/ClubCard'
import PageSkeleton from '../components/PageSkeleton'
import { useApi } from '../lib/useApi'

interface EventItem {
  id: string
  name: string
  status: string
  clubName?: string | null
  registrationEndTime?: string
  createdAt: string
  participantCount?: number
}

interface ClubItem {
  id: string
  name: string
  description?: string
  location?: string
  createdBy?: string
  createdAt?: string
  logoUrl?: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const { request, loading, error } = useApi()
  const [events, setEvents] = useState<EventItem[]>([])
  const [clubs, setClubs] = useState<ClubItem[]>([])
  const [activeTab, setActiveTab] = useState<'events' | 'clubs'>('events')

  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchData = async () => {
      const evRes = await request<{ events: EventItem[] }>({ url: '/api/events', method: 'get' })
      setEvents(evRes.events)
      const clubRes = await request<{ clubs: any[] }>({ url: '/api/clubs', method: 'get' })
      setClubs(
        clubRes.clubs.map(c => ({
          id: c._id || c.id,
          name: c.name,
          description: c.description,
          location: c.location,
          createdBy: c.createdBy,
          createdAt: c.createdAt,
          logoUrl: c.logoUrl,
        }))
      )
    }
    fetchData()
  }, [status, request])

  if (status === 'loading' || loading) {
    return <PageSkeleton />
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Game Planer</h1>
        <p className="text-center">Plan games for our lovely PIV Club members.</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4">Failed to load.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'events' ? 'default' : 'outline'}
          onClick={() => setActiveTab('events')}
        >
          Events
        </Button>
        <Button
          variant={activeTab === 'clubs' ? 'default' : 'outline'}
          onClick={() => setActiveTab('clubs')}
        >
          Clubs
        </Button>
      </div>
      {activeTab === 'events' && (
        <div className="space-y-4">
          <h1 className="text-2xl mb-2">Available Events</h1>
          {events.length === 0 ? (
            <p>No events.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(e => (
                <Link key={e.id} href={`/events/${e.id}`} className="block">
                  <EventCard event={e} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'clubs' && (
        <div className="space-y-4">
          <h1 className="text-2xl mb-2">Clubs</h1>
          {clubs.length === 0 ? (
            <p>No clubs.</p>
          ) : (
            <div className="space-y-2">
              {clubs.map(c => (
                <Link key={c.id} href={`/clubs/${c.id}`}
                  className="block">
                  <ClubCard club={c} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
