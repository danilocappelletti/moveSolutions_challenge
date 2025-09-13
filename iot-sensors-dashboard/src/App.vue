<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Sensor } from './types'
import SensorTable from './components/SensorTable.vue'
import SensorChart from './components/Chart.vue'

const sensors = ref<Sensor[]>([])
const loading = ref<boolean>(true)
const selectedSensor = ref<Sensor | null>(null)

onMounted(async () => {
  try {
    const response = await fetch('/data/sensors.json')
    const data: Sensor[] = await response.json()
    sensors.value = data
  } catch (error) {
    console.error('Error loading sensors:', error)
  } finally {
    loading.value = false
  }
})

const handleSensorSelected = (sensor: Sensor) => {
  selectedSensor.value = sensor
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">IoT Sensors Dashboard</h1>
            <p class="mt-1 text-gray-600">Monitor bridge and tunnel sensors</p>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-500">Live</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Sensors Table -->
        <div class="space-y-6">
          <SensorTable 
            :sensors="sensors" 
            :loading="loading"
            @sensor-selected="handleSensorSelected"
          />
        </div>
        
        <!-- Chart -->
        <div class="space-y-6">
          <SensorChart :sensor="selectedSensor" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>