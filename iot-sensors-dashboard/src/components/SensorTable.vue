<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Sensor } from '../types'
import { getAllLastValues } from '../api/mockApis'
import SensorTableRow from './tableComponents/SensorTableRow.vue'
import SensorTableHead from './tableComponents/SensorTableHead.vue'

interface Props {
  sensors: Sensor[]
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sensorSelected: [sensor: Sensor]
}>()

const sortColumn = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')

const lastValues = ref<Record<string, number>>({})
const loadingLastValues = ref(true)

onMounted(async () => {
  loadingLastValues.value = true
  
  try {
    const values = await getAllLastValues()
    lastValues.value = values
  } catch (error) {
    console.error('Error fetching last values:', error)
  } finally {
    loadingLastValues.value = false
  }
})

const getLastValue = (sensorId: string): number => {
  return lastValues.value[sensorId] || 0
}

const getStatus = (sensor: Sensor): 'OK' | 'ALARM' => {
  const lastValue = getLastValue(sensor.id)
  return lastValue > sensor.threshold ? 'ALARM' : 'OK'
}

const sortedSensors = computed(() => {
  if (!sortColumn.value) return props.sensors
  
  const sorted = [...props.sensors].sort((a, b) => {
    let aValue: any = a[sortColumn.value as keyof Sensor]
    let bValue: any = b[sortColumn.value as keyof Sensor]

    if (sortColumn.value === 'status') {
      aValue = getStatus(a)
      bValue = getStatus(b)
    }
    
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
})

const sortBy = (column: string, event: Event) => {
  event.stopPropagation()
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const selectSensor = (sensor: Sensor) => {
  emit('sensorSelected', sensor)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Sensors Overview</h3>
    </div>
    
    <div v-if="loading" class="p-6 text-center">
      <p class="text-gray-500">Loading sensors...</p>
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <SensorTableHead
          :current-sort-column="sortColumn"
          :sort-direction="sortDirection"
          @sort="sortBy"
        />
        <tbody class="bg-white divide-y divide-gray-200">
          <SensorTableRow
            v-for="sensor in sortedSensors" 
            :key="sensor.id"
            :sensor="sensor"
            :last-value="getLastValue(sensor.id)"
            :loading-last-values="loadingLastValues"
            :status="getStatus(sensor)"
            @sensor-selected="selectSensor"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>