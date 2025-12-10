// Скрипт для подписки устройства на топик daily-gifts
// Использование: node subscribe-to-topic.js <FCM_TOKEN>

const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function subscribeToTopic() {
  const token = process.argv[2];
  
  if (!token) {
    console.log('❌ Использование: node subscribe-to-topic.js <FCM_TOKEN>');
    console.log('');
    console.log('Токен можно найти в консоли браузера после включения уведомлений');
    console.log('(ищи "FCM Token: ...")');
    process.exit(1);
  }
  
  try {
    const response = await admin.messaging().subscribeToTopic([token], 'daily-gifts');
    console.log('✅ Устройство подписано на топик daily-gifts!');
    console.log('Результат:', response);
  } catch (error) {
    console.error('❌ Ошибка подписки:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

subscribeToTopic();

