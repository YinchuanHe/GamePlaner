'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface ClubData {
  id: string;
  name: string;
  members: string[];
  events: string[];
}

export default function ClubManage() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [club, setClub] = useState<ClubData | null>(null);
  const [newName, setNewName] = useState('');
  const [newMember, setNewMember] = useState('');
  const [newEvent, setNewEvent] = useState('');

  useEffect(() => {
    axios.get('/api/auth/get-session?disableRefresh=true').then(async res => {
      const r = res.data?.session?.user?.role;
      const u = res.data?.session?.user?.email;
      if (!r || (r !== 'admin' && r !== 'super-admin')) {
        router.push('/');
        return;
      }
      setRole(r);
      setUsername(u);
      const prof = await axios.get('/api/profile', { headers: { 'x-username': u } });
      if (!prof.data.club) {
        router.push('/');
        return;
      }
      const c = await axios.get(`/api/clubs/${prof.data.clubId || prof.data.club}`);
      setClub(c.data);
      setNewName(c.data.name);
    });
  }, [router]);

  if (!club) return <div className="p-4">Loading...</div>;

  const headers = { 'x-role': role, 'x-username': username };

  const updateName = async () => {
    await axios.put(`/api/clubs/${club.id}`, { name: newName }, { headers });
    setClub({ ...club, name: newName });
  };

  const addMember = async () => {
    await axios.post(`/api/clubs/${club.id}/members`, { username: newMember }, { headers });
    setClub({ ...club, members: [...club.members, newMember] });
    setNewMember('');
  };

  const removeMember = async (m: string) => {
    await axios.delete(`/api/clubs/${club.id}/members`, { data: { username: m }, headers });
    setClub({ ...club, members: club.members.filter(x => x !== m) });
  };

  const makeAdmin = async (m: string) => {
    await axios.put('/api/users', { username: m, role: 'admin' }, { headers });
  };

  const createEvent = async () => {
    await axios.post('/api/events', { name: newEvent, clubId: club.id }, { headers });
    const evRes = await axios.get(`/api/events?clubId=${club.id}`);
    setClub({ ...club, events: evRes.data.events.map((e: any) => e.name) });
    setNewEvent('');
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Manage {club.name}</h1>
      <div className="space-x-2">
        <Input value={newName} onChange={e => setNewName(e.target.value)} />
        <Button onClick={updateName}>Change Name</Button>
      </div>
      <div className="space-x-2">
        <Input placeholder="New Member" value={newMember} onChange={e => setNewMember(e.target.value)} />
        <Button onClick={addMember}>Add Member</Button>
      </div>
      <div>
        <h2 className="text-xl mb-2">Members</h2>
        <ul className="list-disc ml-4 space-y-1">
          {club.members.map(m => (
            <li key={m} className="flex items-center space-x-2">
              <span>{m}</span>
              <Button size="sm" onClick={() => removeMember(m)}>Kick</Button>
              <Button size="sm" variant="secondary" onClick={() => makeAdmin(m)}>Make Admin</Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-x-2">
        <Input placeholder="New Event" value={newEvent} onChange={e => setNewEvent(e.target.value)} />
        <Button onClick={createEvent}>Create Event</Button>
      </div>
      <div>
        <h2 className="text-xl mb-2">Events</h2>
        <ul className="list-disc ml-4">
          {club.events.map(e => <li key={e}>{e}</li>)}
        </ul>
      </div>
    </div>
  );
}
