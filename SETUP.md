# 🚀 Инструкция по настройке

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Создание проекта Firebase

1. Перейди на [Firebase Console](https://console.firebase.google.com/)
2. Нажми "Добавить проект"
3. Введи название проекта (например, "advent-calendar-sonya")
4. Следуй инструкциям создания проекта

## Шаг 3: Настройка Cloud Messaging

1. В Firebase Console открой свой проект
2. Зайди в Project Settings (шестерёнка слева вверху)
3. Перейди на вкладку "Cloud Messaging"
4. Найди "Web Push certificates" и сгенерируй пару ключей VAPID
5. Скопируй ключ

## Шаг 4: Получение конфигурации Firebase

1. В Project Settings выбери вкладку "General"
2. Прокрути вниз до раздела "Your apps"
3. Нажми на иконку веба (</>)
4. Зарегистрируй приложение с именем "Advent Calendar"
5. Скопируй объект `firebaseConfig`

## Шаг 5: Вставка конфигурации в проект

### Файл: `src/firebase.js`

Замени строки:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

На свою конфигурацию из Firebase.

Также замени:
```javascript
vapidKey: 'YOUR_VAPID_KEY'
```

На свой VAPID ключ из Шага 3.

### Файл: `public/firebase-messaging-sw.js`

Вставь ту же конфигурацию Firebase в этот файл.

## Шаг 6: Создание иконок для PWA

Используй онлайн-генератор, например:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Загрузи картинку с подарком/ёлкой и создай:
- `pwa-192x192.png`
- `pwa-512x512.png`
- `apple-touch-icon.png` (180x180)

Положи их в папку `public/`

## Шаг 7: Редактирование подарков

Открой `src/gifts.js` и отредактируй:
- `location` - где находится подарок
- `hint` - подсказка
- `emoji` - эмодзи для визуализации

## Шаг 8: Запуск

```bash
npm run dev
```

Открой в браузере указанный URL (обычно http://localhost:5173)

## Шаг 9: Деплой

### Вариант 1: Firebase Hosting (рекомендуется)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Выбери свой проект
# Public directory: dist
# Single-page app: Yes
# GitHub actions: No

npm run build
firebase deploy
```

### Вариант 2: Vercel

```bash
npm install -g vercel
vercel
# Следуй инструкциям
```

### Вариант 3: Netlify

1. Зарегистрируйся на netlify.com
2. Подключи GitHub репозиторий
3. Build command: `npm run build`
4. Publish directory: `dist`

## Шаг 10: Настройка автоматических уведомлений

### Вариант 1: Firebase Cloud Functions

Создай файл `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Отправка уведомлений каждый день в 9:00
exports.sendDailyNotification = functions.pubsub
  .schedule('0 9 * 12 *') // Каждый день декабря в 9:00
  .timeZone('Europe/Moscow') // Укажи свой часовой пояс
  .onRun(async (context) => {
    const today = new Date().getDate();
    
    const message = {
      notification: {
        title: `🎁 День ${today} - Новый подарок!`,
        body: 'У тебя есть подарок на сегодня! Открой календарь 💝',
      },
      topic: 'daily-gifts'
    };
    
    await admin.messaging().send(message);
    return null;
  });
```

Деплой:
```bash
firebase deploy --only functions
```

### Вариант 2: GitHub Actions (бесплатно)

Создай файл `.github/workflows/notifications.yml`:

```yaml
name: Daily Notifications

on:
  schedule:
    - cron: '0 6 * 12 *'  # 9:00 MSK = 6:00 UTC

jobs:
  send-notification:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Send notification
        run: |
          curl -X POST https://fcm.googleapis.com/fcm/send \
            -H "Authorization: key=${{ secrets.FCM_SERVER_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{
              "to": "/topics/daily-gifts",
              "notification": {
                "title": "🎁 Новый подарок!",
                "body": "У тебя есть подарок на сегодня!"
              }
            }'
```

## Шаг 11: Тестирование на iPhone

1. Открой сайт в Safari
2. Нажми кнопку "Поделиться"
3. Выбери "На экран «Домой»"
4. Разрешите уведомления

## Готово! 🎉

Теперь Соня может каждый день получать уведомления о подарках! ❤️

