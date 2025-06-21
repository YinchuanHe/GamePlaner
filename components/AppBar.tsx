'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Menu } from 'lucide-react'


export default function AppBar() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-gray-100 border-b px-4 py-2">
      <Link href="/" className="font-semibold">PAiMO</Link>
      <div className="space-x-4 flex items-center relative">
        {!session ? (
          <Link href="/login" className="hover:underline">Login</Link>
        ) : (
          <div className="flex items-center space-x-2">
            <p>{session.user?.name || session.user?.email}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push('/user')}>
                  My Clubs
                </DropdownMenuItem>
                {(session.user?.role === 'super-admin' || session.user?.role === 'admin') && (
                  <DropdownMenuItem onSelect={() => router.push('/event-edit')}>
                    Event Edit
                  </DropdownMenuItem>
                )}
                {session.user?.role === 'super-admin' && (
                  <DropdownMenuItem onSelect={() => router.push('/manage')}>
                    Manage
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  )
}

