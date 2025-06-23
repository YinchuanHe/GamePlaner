import webpush from 'web-push';

const publicKey = process.env.VAPID_PUBLIC_KEY || '';
const privateKey = process.env.VAPID_PRIVATE_KEY || '';

if (publicKey && privateKey) {
  webpush.setVapidDetails('mailto:example@yourdomain.org', publicKey, privateKey);
}

export interface PushSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function sendPush(
  subscription: PushSubscription,
  payload: any,
) {
  if (!publicKey || !privateKey) {
    console.warn('VAPID keys not configured');
    return;
  }
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.error('Error sending push', err);
  }
}
