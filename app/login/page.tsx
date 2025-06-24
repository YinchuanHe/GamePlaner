'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useApi } from '../../lib/useApi';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { request } = useApi();

  const handleEmailLogin = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/myclub');
    }
  };

  const handleGoogle = async () => {
    await signIn('google');
  };

  const handleResetPassword = async () => {
    setMessage('');
    try {
      await request({ url: '/api/request-password-reset', method: 'post' });
      setMessage('Password reset email sent');
    } catch {
      setMessage('Failed to send reset email');
    }
  };

  return (
    <div className="mx-auto max-w-xs py-8">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <div className="space-y-4">
        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" onClick={handleEmailLogin}>Login</Button>
        <Button className="w-full" onClick={handleGoogle}>Login With Google</Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
        <Button variant="outline" className="w-full" onClick={handleResetPassword}>
          Reset Password
        </Button>
        {message && <p className="text-green-500 text-sm">{message}</p>}
      </div>
    </div>
  );
}
