<script setup lang="ts">
import type { Sensor } from '@/types';

interface Props {
  sensor: Sensor | null,
  measurements: { measurements: { timestamp: string; disp_mm: number }[] }
}

const props = defineProps<Props>()
</script>

<template>
    <div class="mt-4 grid grid-cols-3 gap-4">
        <div class="text-center p-3 bg-gray-50 rounded-lg">
            <p class="text-2xl font-bold text-gray-800">{{ props.measurements.measurements.length }}</p>
            <p class="text-sm text-gray-600">Data Points</p>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600">{{ props.sensor && props.sensor.threshold }}mm</p>
            <p class="text-sm text-gray-600">Threshold</p>
        </div>
        <div class="text-center p-3 bg-blue-50 rounded-lg">
            <p class="text-2xl font-bold text-blue-600">3</p>
            <p class="text-sm text-gray-600">Days</p>
        </div>
    </div>
</template>

<style scoped></style>