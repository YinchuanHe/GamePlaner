'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import EventCard from '../../../components/EventCard';

interface Member {
  id: string;
  username: string;
}

interface EventItem {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  participantCount?: number;
  visibility: string;
}

export default function ClubHome({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [clubName, setClubName] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [newEventName, setNewEventName] = useState('');

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
      setIsMember(
        res.data.members.some((m: Member) => m.id === session?.user?.id)
      );
    };
    fetchClub();
  }, [status, session, router, params.id]);

  const isAdmin =
    session?.user?.role === 'admin' || session?.user?.role === 'super-admin';
  const showEvents = isAdmin || isMember;

  const joinClub = async () => {
    await axios.post(`/api/clubs/${params.id}`);
    const res = await axios.get(`/api/clubs/${params.id}`);
    setMembers(res.data.members);
    setEvents(res.data.events);
    setIsMember(res.data.members.some((m: Member) => m.id === session?.user?.id));
  };

  const createEvent = async () => {
    if (!newEventName) return;
    await axios.post('/api/events', { name: newEventName, clubId: params.id });
    setNewEventName('');
    const res = await axios.get(`/api/clubs/${params.id}`);
    setEvents(res.data.events);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{clubName}</h1>
      {showEvents && (
        <div>
          <h2 className="text-xl mb-2">Ongoing Events</h2>
          {events.filter(e => isMember || e.visibility !== 'private').length === 0 ? (
            <p>No events.</p>
          ) : (
            <div className="space-y-2">
              {events
                .filter(e => isMember || e.visibility !== 'private')
                .map(e => (
                  <Link key={e.id} href={`/events/${e.id}`}> 
                    <EventCard event={e} />
                  </Link>
                ))}
            </div>
          )}
          {isAdmin && (
            <div className="mt-2 space-x-2 flex items-center">
              <Input
                value={newEventName}
                onChange={e => setNewEventName(e.target.value)}
                placeholder="Event name"
                className="w-48"
              />
              <Button onClick={createEvent}>Create Event</Button>
            </div>
          )}
        </div>
      )}
      <div>
        <h2 className="text-xl mb-2">Members</h2>
        <ul className="list-disc list-inside space-y-1">
          {members?.map(m => (
            <li key={m.id}>{m.username}</li>
          ))}
        </ul>
      </div>
      {!isMember && (
        <Button onClick={joinClub}>Join us!</Button>
      )}
    </div>
  );
}
