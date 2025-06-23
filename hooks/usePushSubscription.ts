'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function usePushSubscription() {
  const { status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    const register = async () => {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return
      const reg = await navigator.serviceWorker.register('/sw.js')
      const existing = await reg.pushManager.getSubscription()
      const sub =
        existing ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        }))
      if (!sub) return
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
    }

    register().catch(console.error)
  }, [status])
}
