<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Sensor } from './types'
import Header from './components/main/Header.vue'
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
    <Header />
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-7 gap-8">
        <div class="xl:col-span-4 space-y-6">
          <SensorTable 
            :sensors="sensors" 
            :loading="loading"
            @sensor-selected="handleSensorSelected"
          />
        </div>
        
        <!-- Chart - takes 3 columns (~43%) -->
        <div class="xl:col-span-3 space-y-6">
          <SensorChart :sensor="selectedSensor" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>