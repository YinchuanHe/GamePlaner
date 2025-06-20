'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ClubCard from '../../components/ClubCard'
import PageSkeleton from '../../components/PageSkeleton'
import { useApi } from '../../lib/useApi'

interface Club {
  id: string
  name: string
  description?: string
  location?: string
  createdBy?: string
  createdAt?: string
  logoUrl?: string
}

export default function UserPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { request, loading, error } = useApi()
  const [clubs, setClubs] = useState<Club[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    const fetchClubs = async () => {
      const res = await request<{ clubs: Club[] }>({ url: '/api/myclubs', method: 'get' })
      setClubs(res.clubs)
    }
    fetchClubs()
  }, [status, session, router, request])

  if (status === 'loading' || loading) {
    return <PageSkeleton />
  }

  if (error) {
    return <div className="p-4">Failed to load.</div>
  }

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl mb-4">My Clubs</h1>
      {clubs.length === 0 ? (
        <p>You are not a member of any clubs.</p>
      ) : (
        <div className="space-y-2">
          {clubs.map(c => (
            <Link key={c.id} href={`/clubs/${c.id}`}>
              <ClubCard club={c} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
