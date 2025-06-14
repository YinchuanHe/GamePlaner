'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/auth/sign-in/email', { email, password });
      if (res.data.success) {
        localStorage.setItem('loggedIn', 'true');
        const session = await axios.get('/api/auth/get-session?disableRefresh=true');
        const role = session.data?.session?.user?.role;
        if (role) localStorage.setItem('role', role);
        localStorage.setItem('username', email);
        router.push('/profile');
      }
    } catch (e: any) {
      setError('Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    const res = await axios.post('/api/auth/sign-in/social', {
      provider: 'google',
      callbackURL: '/profile',
    });
    if (res.data.redirect && res.data.url) {
      window.location.href = res.data.url;
    }
  };

  return (
    <div className="mx-auto max-w-xs py-8">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <div className="space-y-4">
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" onClick={handleSubmit}>Login</Button>
        <Button className="w-full" variant="secondary" onClick={handleGoogleLogin}>Login with Google</Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
