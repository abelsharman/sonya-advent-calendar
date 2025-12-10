// Тестовая отправка уведомления напрямую на устройство (по токену)
// Использование: node test-notification.js <FCM_TOKEN>

const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendTestNotification() {
  const token = process.argv[2];
  
  if (!token) {
    console.log('❌ Использование: node test-notification.js <FCM_TOKEN>');
    console.log('');
    console.log('Токен можно найти в консоли браузера после включения уведомлений');
    console.log('(ищи "FCM Token: ...")');
    process.exit(1);
  }
  
  const message = {
    notification: {
      title: '🎁 Тестовое уведомление!',
      body: 'Если видишь это - пуши работают! 🎉',
    },
    webpush: {
      fcmOptions: {
        link: 'https://sonya-advent-calendar.abelsharman.kz'
      },
      notification: {
        vibrate: [200, 100, 200],
        tag: 'test-notification',
      }
    },
    token: token
  };
  
  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Тестовое уведомление отправлено!');
    console.log('Response:', response);
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

sendTestNotification();

