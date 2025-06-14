'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ProfileData {
  username: string;
  role: string;
  club: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');
    if (!loggedIn || !username) {
      router.push('/login');
      return;
    }
    axios
      .get('/api/profile', { headers: { 'x-username': username } })
      .then(res => setData(res.data));
  }, [router]);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl mb-4">Profile</h1>
      <p><strong>Username:</strong> {data.username}</p>
      <p><strong>Role:</strong> {data.role}</p>
      <p><strong>Club:</strong> {data.club || 'None'}</p>
    </div>
  );
}
