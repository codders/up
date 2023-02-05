importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-messaging-compat.js');
importScripts('swenv.js')

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'up-now-a6da8.firebaseapp.com',
  databaseURL: 'https://up-now-a6da8.firebaseio.com',
  projectId: 'up-now-a6da8',
  storageBucket: 'up-now-a6da8.appspot.com',
  messagingSenderId: '884424894711',
  appId: process.env.FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

// Setup event listeners for actions provided in the config:
self.addEventListener('notificationclick', function(e) {
  console.log("Got notification click!", e)
  const actions = [
    {
      action: 'go_to_up',
      url: 'https://up.codders.io/'
    }
  ]
  const action = actions.find(x => x.action === e.action)
  const notification = e.notification

  if (!action) return

  if (action.url) {
    clients.openWindow(action.url)
    notification.close()
  }
})

console.log("This is the end of the messaging service worker 202202031753.")
