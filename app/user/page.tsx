'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'

interface Club { id: string; name: string }

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
        <ul className="list-disc list-inside">
          {clubs.map(c => (
            <li key={c.id}>
              <a href={`/clubs/${c.id}`} className="text-blue-600 hover:underline">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
