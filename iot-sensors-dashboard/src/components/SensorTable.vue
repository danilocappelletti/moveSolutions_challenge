<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Sensor } from '../types'
import { useSensorStore } from '../stores/sensorStore'
import SensorTableRow from './tableComponents/SensorTableRow.vue'
import SensorTableHead from './tableComponents/SensorTableHead.vue'
import TableHeader from './tableComponents/TableHeader.vue'

interface Props {
  sensors: Sensor[]
  loading: boolean
  selectedSensor: Sensor | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sensorSelected: [sensor: Sensor]
}>()

const sortColumn = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')

const sensorStore = useSensorStore()

const sortedSensors = computed(() => {
  if (!sortColumn.value) return props.sensors
  
  const sorted = [...props.sensors].sort((a, b) => {
    let aValue: any = a[sortColumn.value as keyof Sensor]
    let bValue: any = b[sortColumn.value as keyof Sensor]

    if (sortColumn.value === 'status') {
      aValue = sensorStore.getSensorStatus(a)
      bValue = sensorStore.getSensorStatus(b)
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
    <TableHeader 
      title="Sensors Overview"
      :is-live="sensorStore.isLiveUpdating"
      :show-manual-update="true"
    />
    
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
            :last-value="sensorStore.getLastValueForSensor(sensor.id)"
            :loading-last-values="false"
            :status="sensorStore.getSensorStatus(sensor)"
            :selected-sensor="selectedSensor"
            @sensor-selected="selectSensor"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>