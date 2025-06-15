'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import EventCard from '../components/EventCard'
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

export default function Home() {
  const { data: session, status } = useSession()
  const { request, loading, error } = useApi()
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchEvents = async () => {
      const res = await request<{ events: EventItem[] }>({ url: '/api/events', method: 'get' })
      setEvents(res.events)
    }
    fetchEvents()
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
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4">Failed to load.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl mb-2">Available Events</h1>
      {events.length === 0 ? (
        <p>No events.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(e => (
            <Link key={e.id} href={`/events/${e.id}`}
              className="block">
              <EventCard event={e} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
