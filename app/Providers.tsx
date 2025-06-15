'use client'

import AppBar from '@/components/AppBar'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppBar/>
      {children}
    </SessionProvider>
  );
}