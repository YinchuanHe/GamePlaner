'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import ClubCard from '../../components/ClubCard'

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
  const [clubs, setClubs] = useState<Club[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    const fetchClubs = async () => {
      const res = await axios.get('/api/myclubs')
      setClubs(res.data.clubs)
    }
    fetchClubs()
  }, [status, session, router])

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
