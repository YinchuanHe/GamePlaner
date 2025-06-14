'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from './ui/button'

export default function AppBar() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoggedIn(localStorage.getItem('loggedIn') === 'true')
      setRole(localStorage.getItem('role') || '')
    }
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout')
    } catch (e) {
      // ignore errors
    }
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
    setLoggedIn(false)
    router.push('/')
  }

  return (
    <nav className="flex items-center justify-between bg-gray-100 border-b px-4 py-2">
      <Link href="/" className="font-semibold">Game Planer</Link>
      <div className="space-x-4 flex items-center relative">
        <Link href="/" className="hover:underline">Home</Link>
        {loggedIn ? (
          <>
            <div className="relative">
              <Button variant="ghost" onClick={() => setMenuOpen(p => !p)} className="px-2 py-1 h-auto">Menu</Button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 min-w-[120px]">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  {role === 'super-admin' && (
                    <Link href="/manage" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Manage</Link>
                  )}
                  {(role === 'admin' || role === 'super-admin') && (
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
