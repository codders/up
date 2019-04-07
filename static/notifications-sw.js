console.log('Notifications service worker!')

self.addEventListener('push', function(event) {
  if (event.data) {
    console.log('Got Push event with data: ', event.data.text())
  } else {
    console.log('Got Push event with no data.')
  }
  const promiseChain = self.registration.showNotification('Hello, Notifications')
  event.waitUntil(promiseChain)
})

