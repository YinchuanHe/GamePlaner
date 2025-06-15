'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import EventCard from '../../../components/EventCard';
import ClubCard from '../../../components/ClubCard';
import PageSkeleton from '../../../components/PageSkeleton'
import { useApi } from '../../../lib/useApi'

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
  const { request, loading, error } = useApi();
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [clubName, setClubName] = useState('');
  const [clubDesc, setClubDesc] = useState('');
  const [clubLocation, setClubLocation] = useState('');
  const [clubCreatedBy, setClubCreatedBy] = useState('');
  const [clubCreatedAt, setClubCreatedAt] = useState('');
  const [clubLogo, setClubLogo] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [newEventName, setNewEventName] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    const fetchClub = async () => {
      const res = await request<{ club: any; members: Member[]; events: EventItem[] }>({
        url: `/api/clubs/${params.id}`,
        method: 'get',
      });
      setMembers(res.members);
      setEvents(res.events);
      setClubName(res.club.name);
      setClubDesc(res.club.description || '');
      setClubLocation(res.club.location || '');
      setClubCreatedBy(res.club.createdBy || '');
      setClubCreatedAt(res.club.createdAt || '');
      setClubLogo(res.club.logoUrl || '');
      setIsMember(res.members.some((m: Member) => m.id === session?.user?.id));
    };
    fetchClub();
  }, [status, session, router, params.id, request]);

  const isAdmin =
    session?.user?.role === 'admin' || session?.user?.role === 'super-admin';
  const showEvents = isAdmin || isMember;

  const joinClub = async () => {
    await request({ url: `/api/clubs/${params.id}`, method: 'post' });
    const res = await request<{ club: any; members: Member[]; events: EventItem[] }>({
      url: `/api/clubs/${params.id}`,
      method: 'get',
    });
    setMembers(res.members);
    setEvents(res.events);
    setClubName(res.club.name);
    setClubDesc(res.club.description || '');
    setClubLocation(res.club.location || '');
    setClubCreatedBy(res.club.createdBy || '');
    setClubCreatedAt(res.club.createdAt || '');
    setClubLogo(res.club.logoUrl || '');
    setIsMember(res.members.some((m: Member) => m.id === session?.user?.id));
  };

  const createEvent = async () => {
    if (!newEventName) return;
    await request({
      url: '/api/events',
      method: 'post',
      data: { name: newEventName, clubId: params.id },
    });
    setNewEventName('');
    const res = await request<{ club: any; events: EventItem[] }>({
      url: `/api/clubs/${params.id}`,
      method: 'get',
    });
    setEvents(res.events);
    setClubName(res.club.name);
    setClubDesc(res.club.description || '');
    setClubLocation(res.club.location || '');
    setClubCreatedBy(res.club.createdBy || '');
    setClubCreatedAt(res.club.createdAt || '');
    setClubLogo(res.club.logoUrl || '');
  };

  if (status === 'loading' || loading) {
    return <PageSkeleton />
  }

  if (error) {
    return <div className="p-4">Failed to load.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <ClubCard
        club={{
          id: params.id,
          name: clubName,
          description: clubDesc,
          location: clubLocation,
          createdBy: clubCreatedBy,
          createdAt: clubCreatedAt,
          logoUrl: clubLogo,
        }}
      />
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
