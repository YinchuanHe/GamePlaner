'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function ManagePage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [clubName, setClubName] = useState('');
  const [eventName, setEventName] = useState('');
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([]);
  const [clubEdits, setClubEdits] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    axios.get('/api/auth/get-session?disableRefresh=true').then(res => {
      const role = res.data?.session?.user?.role;
      if (role !== 'super-admin') {
        router.push('/');
        return;
      }
      fetchUsers(role);
      fetchClubs(role);
    });
  }, [router]);

  const fetchUsers = async (role: string | null) => {
    const res = await axios.get('/api/users', { headers: { 'x-role': role || '' } });
    setUsers(res.data.users);
  };

  const fetchClubs = async (role: string | null) => {
    const res = await axios.get('/api/clubs');
    setClubs(res.data.clubs.map((c: any) => ({ id: c._id, name: c.name })));
  };

  const handleRoleChange = async (username: string, newRole: string) => {
    const { data } = await axios.get('/api/auth/get-session?disableRefresh=true');
    const role = data?.session?.user?.role;
    await axios.put('/api/users', { username, role: newRole }, { headers: { 'x-role': role || '' } });
    setUsers(prev => prev.map(u => (u.username === username ? { ...u, role: newRole } : u)));
  };

  const handleCreateClub = async () => {
    const { data } = await axios.get('/api/auth/get-session?disableRefresh=true');
    const role = data?.session?.user?.role;
    await axios.post('/api/clubs', { name: clubName }, { headers: { 'x-role': role || '' } });
    setClubName('');
    fetchClubs(role);
  };

  const handleCreateEvent = async () => {
    const { data } = await axios.get('/api/auth/get-session?disableRefresh=true');
    const role = data?.session?.user?.role;
    await axios.post('/api/events', { name: eventName }, { headers: { 'x-role': role || '' } });
    setEventName('');
  };

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
        <div>
          <h2 className="text-lg font-semibold mb-2">Edit Clubs</h2>
          <div className="space-y-2">
            {clubs.map(c => (
              <div key={c.id} className="flex items-center space-x-2">
                <Input
                  value={clubEdits[c.id] ?? c.name}
                  onChange={e => setClubEdits(p => ({ ...p, [c.id]: e.target.value }))}
                />
                <Button
                  onClick={async () => {
                    const { data } = await axios.get('/api/auth/get-session?disableRefresh=true');
                    const role = data?.session?.user?.role;
                    await axios.put(`/api/clubs/${c.id}`, { name: clubEdits[c.id] ?? c.name }, { headers: { 'x-role': role || '' } });
                    fetchClubs(role);
                  }}
                >Update</Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Input placeholder="New Event Name" value={eventName} onChange={e => setEventName(e.target.value)} />
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </div>
      </div>
    </div>
  );
}
