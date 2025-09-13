<script setup lang="ts">
import type { Sensor } from '@/types';

interface Props {
  sensor: Sensor | null
}

const props = defineProps<Props>()
</script>

<template>
    <div class="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    <p class="text-gray-600 text-lg">Loading measurements...</p>
    <p class="text-gray-400 text-sm mt-1">{{ props.sensor && props.sensor.name }}</p>

</template>
