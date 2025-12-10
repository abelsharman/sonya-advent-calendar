<template>
  <div class="min-h-screen p-4 pb-20 relative overflow-hidden">
    <!-- Снежинки для атмосферы -->
    <div v-for="i in 20" :key="i" 
         class="snowflake"
         :style="{
           left: Math.random() * 100 + '%',
           animationDuration: (Math.random() * 3 + 2) + 's',
           animationDelay: Math.random() * 5 + 's',
           fontSize: (Math.random() * 10 + 10) + 'px'
         }">
      ❄️
    </div>

    <!-- Заголовок -->
    <header class="text-center mb-8 pt-8 relative z-10">
      <h1 class="text-4xl md:text-6xl font-bold text-advent-red mb-2 drop-shadow-lg">
        🎄 Адвент-календарь 🎄
      </h1>
      <p class="text-xl md:text-2xl text-pink-600 font-semibold">
        для любимой Сони ❤️
      </p>
      <p class="text-sm text-gray-600 mt-2">
        10-25 декабря 2025
      </p>
      
      <!-- Кнопка включения уведомлений -->
      <button 
        v-if="!notificationsEnabled"
        @click="enableNotifications"
        class="mt-4 bg-advent-green text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-green-600 transition-all hover:scale-105">
        🔔 Включить уведомления
      </button>
      <p v-else class="mt-4 text-green-600 font-semibold">
        ✅ Уведомления включены!
      </p>
    </header>

    <!-- Календарь -->
    <main class="max-w-6xl mx-auto relative z-10">
      <div class="grid grid-cols-4 md:grid-cols-4 gap-3 md:gap-4">
        <div
          v-for="day in daysRange"
          :key="day"
          @click="handleDayClick(day)"
          class="gift-box aspect-square bg-white rounded-2xl shadow-xl cursor-pointer flex flex-col items-center justify-center p-4 border-4"
          :class="{
            'border-advent-red hover:shadow-2xl': isDayUnlocked(day),
            'border-gray-300 opacity-60 cursor-not-allowed': !isDayUnlocked(day),
            'opened bg-gradient-to-br from-red-100 to-pink-100': selectedDay === day
          }">
          
          <!-- Если день открыт -->
          <div v-if="isDayUnlocked(day)" class="text-center">
            <div class="text-4xl mb-2">{{ gifts[day]?.emoji || '🎁' }}</div>
            <div class="text-2xl font-bold text-advent-red">{{ day }}</div>
          </div>
          
          <!-- Если день еще закрыт -->
          <div v-else class="text-center">
            <div class="text-4xl mb-2">🔒</div>
            <div class="text-2xl font-bold text-gray-400">{{ day }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Модальное окно с подарком -->
    <transition name="fade">
      <div 
        v-if="selectedDay && isDayUnlocked(selectedDay)"
        @click="closeModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div 
          @click.stop
          class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-bounce-in">
          
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
            ✕
          </button>
          
          <div class="text-center">
            <div class="text-7xl mb-4">{{ gifts[selectedDay]?.emoji || '🎁' }}</div>
            <h2 class="text-3xl font-bold text-advent-red mb-4">
              День {{ selectedDay }}
            </h2>
            <div class="bg-pink-50 rounded-xl p-6 mb-4">
              <p class="text-lg font-semibold text-gray-700 mb-2">
                {{ gifts[selectedDay]?.hint }}
              </p>
              <p class="text-xl font-bold text-advent-green">
                {{ gifts[selectedDay]?.location }}
              </p>
            </div>
            <p class="text-sm text-gray-500 italic">
              Твой подарок ждёт тебя! 💝
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gifts, isDayUnlocked, getGift } from './gifts.js'
import { requestNotificationPermission, onMessageListener } from './firebase.js'

const selectedDay = ref(null)
const notificationsEnabled = ref(false)

// Диапазон дней с 10 по 25 декабря
const daysRange = computed(() => {
  return Array.from({ length: 16 }, (_, i) => i + 10)
})

const handleDayClick = (day) => {
  if (isDayUnlocked(day)) {
    selectedDay.value = day
  } else {
    alert('🔒 Этот день еще не наступил! Немного терпения ❤️')
  }
}

const closeModal = () => {
  selectedDay.value = null
}

const enableNotifications = async () => {
  const token = await requestNotificationPermission()
  if (token) {
    notificationsEnabled.value = true
    localStorage.setItem('notificationsEnabled', 'true')
  }
}

onMounted(() => {
  // Проверяем, были ли уже включены уведомления
  notificationsEnabled.value = localStorage.getItem('notificationsEnabled') === 'true'
  
  // Слушаем входящие уведомления
  onMessageListener().then(payload => {
    if (payload) {
      console.log('Получено уведомление:', payload)
      // Можно показать уведомление в приложении
    }
  })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}
</style>

