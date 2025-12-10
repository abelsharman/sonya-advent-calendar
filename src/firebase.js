import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// Конфигурация Firebase (нужно будет заполнить своими данными)
const firebaseConfig = {
  apiKey: "AIzaSyAGMld7YM4mHnFg79R6fbaWzo_E70MGnKg",
  authDomain: "sonya-advent-calendar.firebaseapp.com",
  projectId: "sonya-advent-calendar",
  storageBucket: "sonya-advent-calendar.firebasestorage.app",
  messagingSenderId: "1097034460238",
  appId: "1:1097034460238:web:044c3d60c18eb683c0a71f",
  measurementId: "G-7K6TWKL22G"
}

// Инициализация Firebase
const app = initializeApp(firebaseConfig)
let messaging = null

// Проверка поддержки уведомлений
if ('Notification' in window && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app)
  } catch (error) {
    console.log('Firebase Messaging не поддерживается:', error)
  }
}

// Запрос разрешения на уведомления
export async function requestNotificationPermission() {
  if (!messaging) {
    console.log('Messaging не инициализирован')
    return null
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      console.log('Разрешение на уведомления получено')
      
      // Получение токена
      const token = await getToken(messaging, {
        vapidKey: 'BF-udgIHUDxrCdwgM-LpOh8BwEtVScfx253QriXJu0ismNcLhRlcrkKpgw5sxOIYnRjj6xpokeFHt2fHL3nMJ0w'
      })
      
      if (token) {
        console.log('FCM Token:', token)
        // Здесь можно сохранить токен на сервере
        return token
      }
    } else {
      console.log('Разрешение на уведомления не получено')
    }
  } catch (error) {
    console.error('Ошибка при запросе разрешения:', error)
  }
  
  return null
}

// Обработка уведомлений, когда приложение открыто
export function onMessageListener() {
  return new Promise((resolve) => {
    if (!messaging) {
      resolve(null)
      return
    }
    
    onMessage(messaging, (payload) => {
      console.log('Получено сообщение:', payload)
      resolve(payload)
    })
  })
}

