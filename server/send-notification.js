// Скрипт для отправки push-уведомлений через Firebase
// Запускается cron'ом на сервере каждое утро

const admin = require('firebase-admin');

// Инициализация Firebase Admin SDK
// Скачай serviceAccountKey.json из Firebase Console:
// Project Settings → Service accounts → Generate new private key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Функция отправки уведомления
async function sendDailyNotification() {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // 0-11
    
    // Проверяем что сегодня декабрь и дата с 10 по 25
    if (month !== 11 || day < 10 || day > 25) {
      console.log(`⏭️ Сегодня ${day} числа - уведомление не нужно`);
      return;
    }
    
    console.log(`📅 Отправка уведомления для дня ${day}...`);
    
    // Сообщение для уведомления
    const message = {
      notification: {
        title: `🎁 День ${day} - Новый подарок!`,
        body: 'У тебя есть подарок на сегодня! Открой календарь и узнай, где он 💝',
        icon: 'https://sonya-advent-calendar.abelsharman.kz/pwa-192x192.png',
        badge: 'https://sonya-advent-calendar.abelsharman.kz/pwa-192x192.png',
      },
      webpush: {
        fcmOptions: {
          link: 'https://sonya-advent-calendar.abelsharman.kz' // ЗАМЕНИ НА СВОЙ ДОМЕН!
        },
        notification: {
          icon: 'https://sonya-advent-calendar.abelsharman.kz/pwa-192x192.png',
          badge: 'https://sonya-advent-calendar.abelsharman.kz/pwa-192x192.png',
          vibrate: [200, 100, 200],
          requireInteraction: true,
          tag: `advent-day-${day}`,
        }
      },
      // Отправляем всем подписанным на топик
      topic: 'daily-gifts'
    };
    
    // Отправка уведомления
    const response = await admin.messaging().send(message);
    console.log('✅ Уведомление успешно отправлено:', response);
    
  } catch (error) {
    console.error('❌ Ошибка при отправке уведомления:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Запуск
sendDailyNotification();

