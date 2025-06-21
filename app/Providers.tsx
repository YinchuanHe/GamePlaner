'use client'

import AppBar from '@/components/AppBar'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <AppBar />
        <main className="flex-grow">{children}</main>
      </div>
    </SessionProvider>
  );
}
