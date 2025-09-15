<script setup lang="ts">
import type { Sensor } from '../../types'
import StatusBadge from './StatusBadge.vue'

interface Props {
  sensor: Sensor
  lastValue: number
  loadingLastValues: boolean
  status: 'OK' | 'ALARM'
  selectedSensor: Sensor | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sensorSelected: [sensor: Sensor]
}>()

const handleClick = () => {
  emit('sensorSelected', props.sensor)
}

const isSelected = () => {
  return props.selectedSensor?.id === props.sensor.id
}
</script>

<template>
  <tr 
    @click="handleClick"
    :class="[
      'cursor-pointer transition-colors duration-200',
      isSelected() 
        ? 'bg-blue-50 border-l-4 border-l-blue-500' 
        : 'hover:bg-gray-50'
    ]"
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
      <span v-else>{{ lastValue }}mm</span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <StatusBadge 
        :status="loadingLastValues ? null : status"
        :loading="loadingLastValues"
      />
    </td>
  </tr>
</template>