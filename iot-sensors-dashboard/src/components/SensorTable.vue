<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Sensor } from '../types'
import { getAllLastValues } from '../api/mockApis'

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
        <thead class="bg-gray-50">
          <tr>
            <th 
              @click="sortBy('id', $event)"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              ID
              <span v-if="sortColumn === 'id'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="sortBy('name', $event)"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Name
              <span v-if="sortColumn === 'name'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              @click="sortBy('location', $event)"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Location
              <span v-if="sortColumn === 'location'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Value
            </th>
            <th 
              @click="sortBy('status', $event)"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Status
              <span v-if="sortColumn === 'status'">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="sensor in sortedSensors" 
            :key="sensor.id"
            @click="selectSensor(sensor)"
            class="hover:bg-gray-50 cursor-pointer"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ sensor.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ sensor.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ sensor.location }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span v-if="loadingLastValues" class="text-gray-400">Loading...</span>
              <span v-else>{{ getLastValue(sensor.id) }}mm</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="loadingLastValues" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
                Loading...
              </span>
              <span v-else
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  getStatus(sensor) === 'OK' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ getStatus(sensor) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>