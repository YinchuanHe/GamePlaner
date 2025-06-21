'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { Home, CalendarDays, Users, User } from 'lucide-react'

export default function AppFooter() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isEvents = pathname.startsWith('/events') || pathname === '/event-edit'
  const isClubs = pathname.startsWith('/clubs') || pathname === '/user'
  const isProfile = pathname === '/profile'

  const btnClass = (active: boolean) =>
    `flex flex-col items-center space-y-0.5 ${active ? 'text-primary' : 'text-muted-foreground'}`

  return (
    <footer className="border-t p-2 flex items-center justify-around sticky bottom-0 bg-background">
      <Button variant="ghost" className={btnClass(isHome)} asChild>
        <Link href="/">
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
      </Button>
      <Button variant="ghost" className={btnClass(isEvents)} asChild>
        <Link href="/events">
          <CalendarDays className="h-5 w-5" />
          <span className="text-xs">Event</span>
        </Link>
      </Button>
      <Button variant="ghost" className={btnClass(isClubs)} asChild>
        <Link href="/clubs">
          <Users className="h-5 w-5" />
          <span className="text-xs">Club</span>
        </Link>
      </Button>
      <Button variant="ghost" className={btnClass(isProfile)} asChild>
        <Link href="/profile">
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </Button>
    </footer>
  )
}
