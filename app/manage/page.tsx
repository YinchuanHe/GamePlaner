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

  const fetchUsers = async (role: string | null) => {
    const res = await axios.get('/api/users', { headers: { 'x-role': role || '' } });
    setUsers(res.data.users);
  };

  const handleRoleChange = async (username: string, newRole: string) => {
    await axios.put('/api/users', { username, role: newRole });
    setUsers(prev => prev.map(u => (u.username === username ? { ...u, role: newRole } : u)));
  };

  const handleCreateClub = async () => {
    await axios.post('/api/clubs', { name: clubName });
    setClubName('');
  };

  const handleCreateEvent = async () => {
    await axios.post('/api/events', { name: eventName });
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
        <div className="flex items-center space-x-2">
          <Input placeholder="New Event Name" value={eventName} onChange={e => setEventName(e.target.value)} />
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </div>
      </div>
    </div>
  );
}
