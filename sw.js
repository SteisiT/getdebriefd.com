self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'GetDebriefD', {
      body: data.body || '',
      icon: 'https://fav.farm/📋',
      badge: 'https://fav.farm/📋',
      tag: data.tag || 'getdebriefd',
      data: { url: data.url || 'https://getdebriefd.com' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const url = e.notification.data?.url || 'https://getdebriefd.com';
      for (const client of list) {
        if (client.url.includes('getdebriefd.com') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
