'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import PageSkeleton from '../../components/PageSkeleton'
import { useApi } from '../../lib/useApi'


import { Suspense } from 'react';

function CreateProfileClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { request, loading, error: apiError } = useApi();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Populate email from NextAuth session or query param
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    } else {
      const param = searchParams.get('email');
      if (param) setEmail(param);
    }
  }, [session, searchParams]);

  const handleSubmit = async () => {
    try {
      await request({
        url: '/api/signup',
        method: 'post',
        data: { email, username },
      });
      router.push('/login');
    } catch (e: any) {
      setError('Signup failed. Please try again.');
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (apiError) {
    return <div className="p-4">Failed to load.</div>;
  }

  return (
    <div className="mx-auto max-w-xs py-8">
      <h1 className="text-2xl font-semibold mb-4">Create Your Profile</h1>
      <div className="space-y-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" onClick={handleSubmit}>
          Save Profile
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}

export default function CreateProfilePage() {
  return (
    <Suspense>
      <CreateProfileClient />
    </Suspense>
  );
}