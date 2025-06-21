'use client'

import Link from 'next/link'
import { Home, Calendar, Users, User } from 'lucide-react'
import { Button } from './ui/button'

export default function Footer() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background md:hidden">
      <div className="flex justify-around py-2">
        <Button
          variant="ghost"
          asChild
          className="flex flex-col items-center gap-1 text-xs"
        >
          <Link href="/">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          asChild
          className="flex flex-col items-center gap-1 text-xs"
        >
          <Link href="/event-edit">
            <Calendar className="w-5 h-5" />
            <span>Event</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          asChild
          className="flex flex-col items-center gap-1 text-xs"
        >
          <Link href="/user">
            <Users className="w-5 h-5" />
            <span>Club</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          asChild
          className="flex flex-col items-center gap-1 text-xs"
        >
          <Link href="/profile">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </Button>
      </div>
    </nav>
  )
}
