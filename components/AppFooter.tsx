'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

export default function AppFooter() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isProfile = pathname === '/profile'

  return (
    <footer className="border-t p-2 flex items-center justify-around sticky bottom-0 bg-background">
      <Button variant={isHome ? 'default' : 'outline'} asChild>
        <Link href="/">Home</Link>
      </Button>
      <Button variant={isProfile ? 'default' : 'outline'} asChild>
        <Link href="/profile">Profile</Link>
      </Button>
    </footer>
  )
}
