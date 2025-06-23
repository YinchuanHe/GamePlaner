'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageSkeleton from '../../components/PageSkeleton'
import { useApi } from '../../lib/useApi'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import ClubCard from '../../components/ClubCard';
import Link from 'next/link';

interface User {
  username: string;
  role: string;
}

interface ClubOption {
  id: string;
  name: string;
  description?: string;
  location?: string;
  createdBy?: string;
  createdAt?: string;
  logoUrl?: string;
}

export default function ManagePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { request, loading, error } = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [clubName, setClubName] = useState('');
  const [eventName, setEventName] = useState('');
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>('');
  const [pendingUsers, setPendingUsers] = useState<{ id: string; email: string; createdAt: string }[]>([]);

  const fetchUsers = useCallback(async () => {
    const res = await request<{ users: User[] }>({ url: '/api/users', method: 'get' });
    setUsers(res.users);
  }, [request]);

  const handleRoleChange = async (username: string, newRole: string) => {
    await request({
      url: '/api/users',
      method: 'put',
      data: { username, role: newRole },
    });
    setUsers(prev => prev.map(u => (u.username === username ? { ...u, role: newRole } : u)));
  };

  const handleCreateClub = async () => {
    await request({ url: '/api/clubs', method: 'post', data: { name: clubName } });
    setClubName('');
    fetchClubs();
  };

  const fetchClubs = useCallback(async () => {
    const res = await request<{ clubs: any[] }>({ url: '/api/clubs', method: 'get' });
    setClubs(
      res.clubs.map((c: any) => ({
        id: c._id || c.id,
        name: c.name,
        description: c.description,
        location: c.location,
        logoUrl: c.logoUrl,
        createdBy: c.createdBy,
        createdAt: c.createdAt,
      }))
    );
  }, [request]);

  const fetchPending = useCallback(async () => {
    const res = await request<{ users: { id: string; email: string; createdAt: string }[] }>({ url: '/api/pending-users', method: 'get' });
    setPendingUsers(res.users);
  }, [request]);

  const handleCreateEvent = async () => {
    if (!selectedClub) return;
    await request({
      url: '/api/events',
      method: 'post',
      data: { name: eventName, clubId: selectedClub },
    });
    setEventName('');
  };

  const handleResend = async (id: string) => {
    await request({ url: `/api/pending-users/${id}/resend`, method: 'post' });
  };


  const handleRemove = async (id: string) => {
    await request({ url: `/api/pending-users/${id}`, method: 'delete' });
    fetchPending();
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
    fetchPending();
  }, [status, session, router, fetchUsers, fetchClubs, fetchPending]);

  if (status === 'loading' || loading) {
    return <PageSkeleton />
  }

  if (error) {
    return <div className="p-4">Failed to load.</div>
  }

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
          <div className="space-y-2">
            {clubs.map(c => (
              <Link key={c.id} href={`/clubs/${c.id}`}>
                <ClubCard club={c} />
              </Link>
            ))}
          </div>
        </div>
        {pendingUsers.length > 0 &&(
        <div>
          <h2 className="text-lg font-semibold mt-4">Pending Signups</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(p => (
                  <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                    <td className="border p-2">{p.email}</td>
                      <td className="border p-2 space-x-2">
                        <Button size="sm" onClick={() => handleResend(p.id)}>Resend</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemove(p.id)}>
                          Remove
                        </Button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
