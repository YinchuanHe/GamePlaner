self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  const title = data.title || 'Notification'
  const options = {
    body: data.body,
    data: data
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const data = event.notification.data || {}
  const url = data.eventId ? `/events/${data.eventId}` : '/'
  event.waitUntil(clients.openWindow(url))
})
