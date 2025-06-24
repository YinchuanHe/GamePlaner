'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:davidhe92@hotmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

import type { PushSubscription as WebPushSubscription } from 'web-push'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'
import connect from '@/utils/mongoose'
import PushSubscription from '@/models/PushSubscription'

let subscription: WebPushSubscription | null = null

export async function subscribeUser(sub: WebPushSubscription) {
  subscription = sub
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false }
  }

  await connect()
  await PushSubscription.findOneAndUpdate(
    { user: session.user.id, endpoint: sub.endpoint },
    { user: session.user.id, endpoint: sub.endpoint, keys: sub.keys },
    { upsert: true, new: true }
  )

  return { success: true }
}

export async function unsubscribeUser() {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    await connect()
    const query: any = { user: session.user.id }
    if (subscription?.endpoint) query.endpoint = subscription.endpoint
    await PushSubscription.deleteMany(query)
  }
  subscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
