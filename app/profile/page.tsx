'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ProfileData {
  email: string;
  name?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    axios.get('/api/auth/get-session?disableRefresh=true').then(res => {
      if (!res.data || !res.data.session) {
        router.push('/login');
        return;
      }
      setData(res.data.session.user);
    });
  }, [router]);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl mb-4">Profile</h1>
      <p><strong>Email:</strong> {data.email}</p>
      {data.name && <p><strong>Name:</strong> {data.name}</p>}
    </div>
  );
}
