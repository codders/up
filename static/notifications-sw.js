console.log('Notifications service worker!')

self.addEventListener('push', function(event) {
  if (event.data) {
    console.log('Got Push event with data: ', event.data.text())
  } else {
    console.log('Got Push event with no data - cannot show')
    return
  }
  const data = JSON.parse(event.data.text())
  console.log('Data object:', data)
  const title = data.name + ' wants to hang out!'
  let body = 'See what ' + data.name + ' is up to...'
  if (data.description !== undefined) {
    body = data.description
  }
  const promiseChain = self.registration.showNotification(
    title,
    {
      body: body,
      badge: '/nuxt_logo_badge.png',
      icon: '/nuxt_logo_icon.png',
      vibrate: ['250', '50', '50', '50', '50', '50', '500']
    }
  )
  event.waitUntil(promiseChain)
})

self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification
  clickedNotification.close()

  const promiseChain = clients.openWindow('/')
  event.waitUntil(promiseChain)
})

