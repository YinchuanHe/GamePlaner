/// <reference lib="webworker" />
const sw: ServiceWorkerGlobalScope = self as any;

sw.addEventListener('push', (event: any) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notification';
  const options = {
    body: data.body,
    data,
  };
  event.waitUntil(sw.registration.showNotification(title, options));
});

sw.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  const data = event.notification.data || {};
  const url = data.eventId ? `/events/${data.eventId}` : '/';
  event.waitUntil(sw.clients.openWindow(url));
});
