'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { useAuth } from './AuthProvider'

export default function AppBar() {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    await refresh()
    router.push('/')
  }

  return (
    <nav className="flex items-center justify-between bg-gray-100 border-b px-4 py-2">
      <Link href="/" className="font-semibold">Game Planer</Link>
      <div className="space-x-4 flex items-center relative">
        <Link href="/" className="hover:underline">Home</Link>
        {user ? (
          <>
            <div className="relative">
              <Button variant="ghost" onClick={() => setMenuOpen(p => !p)} className="px-2 py-1 h-auto">Menu</Button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 min-w-[120px]">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  {user.role === 'super-admin' && (
                    <Link href="/manage" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Manage</Link>
                  )}
                  {(user.role === 'admin' || user.role === 'super-admin') && (
                    <Link href="/event-edit" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Event Edit</Link>
                  )}
                </div>
              )}
            </div>
            <Button variant="ghost" onClick={handleLogout} className="px-2 py-1 h-auto">Logout</Button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
