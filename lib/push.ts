import webpush from 'web-push'

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:example@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
}

export async function sendPush(subscriptions: any[], payload: any) {
  await Promise.all(
    subscriptions.map(sub =>
      webpush
        .sendNotification(sub, JSON.stringify(payload))
        .catch(err => console.error('Push failed', err)),
    ),
  )
}
