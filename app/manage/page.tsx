'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface User {
  username: string;
  role: string;
}

interface ClubOption {
  id: string;
  name: string;
}

export default function ManagePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [clubName, setClubName] = useState('');
  const [eventName, setEventName] = useState('');
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>('');

  const fetchUsers = async () => {
    const res = await axios.get('/api/users');
    setUsers(res.data.users);
  };

  const handleRoleChange = async (username: string, newRole: string) => {
    await axios.put('/api/users', { username, role: newRole });
    setUsers(prev => prev.map(u => (u.username === username ? { ...u, role: newRole } : u)));
  };

  const handleCreateClub = async () => {
    await axios.post('/api/clubs', { name: clubName });
    setClubName('');
    fetchClubs();
  };

  const fetchClubs = async () => {
    const res = await axios.get('/api/clubs');
    setClubs(res.data.clubs.map((c: any) => ({ id: c._id || c.id, name: c.name })));
  };

  const handleCreateEvent = async () => {
    if (!selectedClub) return;
    await axios.post('/api/events', { name: eventName, clubId: selectedClub });
    setEventName('');
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    if (session.user?.role !== 'super-admin') {
      router.push('/');
      return;
    }
    fetchUsers();
    fetchClubs();
  }, [status, session, router]);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-xl font-semibold mb-4">Role Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Username</th>
              <th className="border p-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.username} className="odd:bg-white even:bg-gray-50">
                <td className="border p-2">{u.username}</td>
                <td className="border p-2">
                  <Select
                    value={u.role}
                    onValueChange={value => handleRoleChange(u.username, value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super-admin">super-admin</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="member">member</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Input placeholder="New Club Name" value={clubName} onChange={e => setClubName(e.target.value)} />
          <Button onClick={handleCreateClub}>Create Club</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="New Event Name"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
          />
          <Select value={selectedClub} onValueChange={setSelectedClub}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Club" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map((c, idx) => (
                <SelectItem key={idx} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </div>
        <div>
          <h2 className="text-lg font-semibold mt-4">All Clubs</h2>
          <ul className="list-disc list-inside space-y-1">
            {clubs.map(c => (
              <li key={c.id}>
                <a href={`/clubs/${c.id}`} className="text-blue-600 hover:underline">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
