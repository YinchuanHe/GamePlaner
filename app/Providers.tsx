'use client'

import AppBar from '@/components/AppBar'
import AppFooter from '@/components/AppFooter'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-dvh">
        <AppBar />
        <main className="flex-grow pb-16">{children}</main>
        <AppFooter />
      </div>
    </SessionProvider>
  );
}
