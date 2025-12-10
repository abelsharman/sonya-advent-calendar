import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import './style.css'
import App from './App.vue'

// Регистрация Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Доступна новая версия приложения')
  },
  onOfflineReady() {
    console.log('Приложение готово к работе оффлайн')
  },
})

createApp(App).mount('#app')
