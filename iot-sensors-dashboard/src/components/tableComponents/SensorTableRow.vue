<script setup lang="ts">
import type { Sensor } from '../../types'
import StatusBadge from './StatusBadge.vue'

interface Props {
  sensor: Sensor
  lastValue: number
  loadingLastValues: boolean
  status: 'OK' | 'ALARM'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sensorSelected: [sensor: Sensor]
}>()

const handleClick = () => {
  emit('sensorSelected', props.sensor)
}
</script>

<template>
  <tr 
    @click="handleClick"
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