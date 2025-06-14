'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      router.replace('/profile');
    } else {
      router.replace('/login');
    }
  }, [router]);
  return null;
}
