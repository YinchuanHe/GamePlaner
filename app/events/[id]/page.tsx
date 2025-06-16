'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import EventEdit from '../../../components/EventEdit';
import PageSkeleton from '../../../components/PageSkeleton'
import { useApi } from '../../../lib/useApi'
import dayjs from 'dayjs';

interface Participant {
  id: string;
  username: string;
}

export default function EventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { request, loading, error } = useApi();
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [editingName, setEditingName] = useState('');
  const [statusText, setStatusText] = useState('');
  const [visibility, setVisibility] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [registrationEndTime, setRegistrationEndTime] = useState('');
  const [clubName, setClubName] = useState('');
  const [clubId, setClubId] = useState('');
  const [location, setLocation] = useState('');
  const [isParticipant, setIsParticipant] = useState(false);

  const fetchEvent = useCallback(async () => {
    const res = await request<{ event: any }>({
      url: `/api/events/${params.id}`,
      method: 'get',
    });
    setName(res.event.name);
    setEditingName(res.event.name);
    setStatusText(res.event.status);
    setVisibility(res.event.visibility);
    setCreatedAt(res.event.createdAt);
    setRegistrationEndTime(res.event.registrationEndTime || '');
    setClubName(res.event.clubName || '');
    setClubId(res.event.club || '');
    setLocation(res.event.location || '');
    setParticipants(res.event.participants);
    if (session?.user?.id) {
      setIsParticipant(res.event.participants.some((p: any) => p.id === session.user?.id));
    }
  }, [params.id, request, session]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchEvent();
  }, [status, session, router, fetchEvent]);

  const isAdmin =
    session?.user?.role === 'admin' || session?.user?.role === 'super-admin';

  const canRegister =
    !isAdmin &&
    !isParticipant &&
    statusText === 'registration' &&
    (!registrationEndTime || dayjs(registrationEndTime).isAfter(dayjs())) &&
    (
      visibility === 'public-join' ||
      session?.user?.role === 'super-admin' ||
      session?.user?.role === 'admin' ||
      (session?.user?.clubs && session.user.clubs.includes(clubId))
    );

  const joinEvent = async () => {
    await request({ url: `/api/events/${params.id}`, method: 'post' });
    fetchEvent();
  };

  const saveName = async () => {
    await request({
      url: `/api/events/${params.id}`,
      method: 'put',
      data: { name: editingName },
    });
    setName(editingName);
  };

  if (status === 'loading' || loading) {
    return <PageSkeleton />
  }

  if (error) {
    return <div className="p-4">Failed to load.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Event</h1>
      {isAdmin ? (
        <div className="space-x-2">
          <Input value={editingName} onChange={e => setEditingName(e.target.value)} />
          <Button onClick={saveName}>Save</Button>
        </div>
      ) : (
        <p className="text-xl">{name}</p>
      )}
      {clubName && (
        <p className="text-sm text-muted-foreground">Host: {clubName}</p>
      )}
      {location && (
        <p className="text-sm text-muted-foreground">Location: {location}</p>
      )}
      <p className="text-sm text-muted-foreground">Status: {statusText}</p>
      {registrationEndTime && (
        <p className="text-sm text-muted-foreground">
          Register by: {dayjs(registrationEndTime).format('YYYY-MM-DD HH:mm')}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Created: {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
      </p>
      <div>
        <h2 className="text-lg mb-2">Participants</h2>
        <ul className="list-disc list-inside space-y-1">
          {participants.map(p => (
            <li key={p.id}>{p.username}</li>
          ))}
        </ul>
      </div>
      {canRegister && (
        <Button onClick={joinEvent}>Register</Button>
      )}
    </div>
  );
}
