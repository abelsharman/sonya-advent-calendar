// Service Worker для Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js')

// Конфигурация Firebase (те же данные, что и в firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyAGMld7YM4mHnFg79R6fbaWzo_E70MGnKg",
  authDomain: "sonya-advent-calendar.firebaseapp.com",
  projectId: "sonya-advent-calendar",
  storageBucket: "sonya-advent-calendar.firebasestorage.app",
  messagingSenderId: "1097034460238",
  appId: "1:1097034460238:web:044c3d60c18eb683c0a71f",
  measurementId: "G-7K6TWKL22G"
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

// Обработка фоновых уведомлений
messaging.onBackgroundMessage((payload) => {
  console.log('Получено фоновое сообщение:', payload)
  
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'advent-calendar',
    requireInteraction: true
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

