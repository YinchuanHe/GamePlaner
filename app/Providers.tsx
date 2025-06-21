'use client'

import AppBar from '@/components/AppBar'
import AppFooter from '@/components/AppFooter'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-col h-full">
        <AppBar />
        <main className="flex-grow overflow-y-auto">{children}</main>
        <AppFooter />
      </div>
    </SessionProvider>
  );
}
