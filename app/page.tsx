'use client'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import AppBar from "../components/AppBar";
import { SessionProvider } from 'next-auth/react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Game Planer</h1>
      <p className="text-center">Plan games for our lovely PIV Club members.</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}
