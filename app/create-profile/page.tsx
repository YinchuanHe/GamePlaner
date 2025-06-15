'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';


export default function CreateProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Populate email from NextAuth session
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmit = async () => {
    try {
      console.log({ session })
      await axios.post('/api/signup', { email, username });
      router.push('/user');
    } catch (e: any) {
      setError('Signup failed. Please try again.');
    }
  };

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