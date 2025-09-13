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
    loading.value = false
  } catch (error) {
    console.error('Error loading sensors:', error)
    loading.value = false
  }
})

const handleSensorSelected = (sensor: Sensor) => {
  selectedSensor.value = sensor
  console.log('Selected sensor:', sensor)
}

</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-8">IoT Sensors Dashboard</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Sensors Table -->
      <div>
        <SensorTable 
          :sensors="sensors" 
          :loading="loading"
          @sensor-selected="handleSensorSelected"
        />
      </div>
      
      <!-- Chart -->
      <div>
        <SensorChart :sensor="selectedSensor" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
