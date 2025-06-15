'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import EventEdit from '../../../components/EventEdit';

interface Participant {
  id: string;
  username: string;
}

export default function EventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [editingName, setEditingName] = useState('');

  const fetchEvent = async () => {
    const res = await axios.get(`/api/events/${params.id}`);
    setName(res.data.event.name);
    setEditingName(res.data.event.name);
    setParticipants(res.data.event.participants);
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchEvent();
  }, [status, session, router]);

  const isAdmin =
    session?.user?.role === 'admin' || session?.user?.role === 'super-admin';

  const joinEvent = async () => {
    await axios.post(`/api/events/${params.id}`);
    fetchEvent();
  };

  const saveName = async () => {
    await axios.put(`/api/events/${params.id}`, { name: editingName });
    setName(editingName);
  };

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
      <div>
        <h2 className="text-lg mb-2">Participants</h2>
        <ul className="list-disc list-inside space-y-1">
          {participants.map(p => (
            <li key={p.id}>{p.username}</li>
          ))}
        </ul>
      </div>
      {isAdmin && <EventEdit />}
      {!isAdmin && (
        <Button onClick={joinEvent}>Join Event</Button>
      )}
    </div>
  );
}
