'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Member {
  id: string;
  username: string;
}

interface EventItem {
  id: string;
  name: string;
}

export default function ClubHome({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [clubName, setClubName] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    const fetchClub = async () => {
      const res = await axios.get(`/api/clubs/${params.id}`);
      setMembers(res.data.members);
      setEvents(res.data.events);
      setClubName(res.data.club.name);
    };
    fetchClub();
  }, [status, session, router, params.id]);

  const showEvents =
    session?.user?.role === 'admin' || session?.user?.role === 'super-admin';

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{clubName}</h1>
      {showEvents && (
        <div>
          <h2 className="text-xl mb-2">Ongoing Events</h2>
          {events.length === 0 ? (
            <p>No events.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {events.map(e => (
                <li key={e.id}>
                  <Link href={`/events/${e.id}`} className="text-blue-600 hover:underline">
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div>
        <h2 className="text-xl mb-2">Members</h2>
        <ul className="list-disc list-inside space-y-1">
          {members.map(m => (
            <li key={m.id}>{m.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
