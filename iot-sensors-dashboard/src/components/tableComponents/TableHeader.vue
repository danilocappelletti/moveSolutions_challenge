<script setup lang="ts">
import { ref } from 'vue'
import { useSensorStore } from '../../stores/sensorStore'

interface Props {
  title: string
  showLiveIndicator?: boolean
  isLive: boolean
  showManualUpdate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLiveIndicator: true,
  showManualUpdate: false
})

const sensorStore = useSensorStore()
const isRefreshing = ref(false)

const handleManualUpdate = async () => {
  isRefreshing.value = true
  
  try {
    sensorStore.triggerManualUpdate()
  } catch (error) {
    console.error('Manual update failed:', error)
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
    }, 300)
  }
}
</script>

<template>
  <div class="px-6 py-4 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <div class="flex items-center space-x-4">
        <!-- Manual Update Button -->
        <button
          v-if="showManualUpdate"
          @click="handleManualUpdate"
          :disabled="isRefreshing"
          class="px-3 py-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50 flex items-center space-x-1"
        >
          <svg 
            :class="['w-3 h-3', { 'animate-spin-reverse': isRefreshing }]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
        </button>
        
        <!-- Live Indicator -->
        <div v-if="showLiveIndicator && isLive" class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-green-400 live-indicator"></div>
          <span class="text-xs font-medium text-gray-700">LIVE</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-indicator {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 1s linear infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>