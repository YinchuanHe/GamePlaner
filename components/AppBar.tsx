'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from './ui/button'

export default function AppBar() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoggedIn(localStorage.getItem('loggedIn') === 'true')
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
      <div className="space-x-4 flex items-center">
        <Link href="/" className="hover:underline">Home</Link>
        {loggedIn && (
          <Link href="/profile" className="hover:underline">Profile</Link>
        )}
        {!loggedIn && (
          <Link href="/login" className="hover:underline">Login</Link>
        )}
        {!loggedIn && (
          <Link href="/signup" className="hover:underline">Sign Up</Link>
        )}
        {loggedIn && (
          <Button variant="ghost" onClick={handleLogout} className="px-2 py-1 h-auto">Logout</Button>
        )}
      </div>
    </nav>
  )
}
