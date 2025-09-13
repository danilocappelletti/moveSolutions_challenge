<script setup lang="ts">
import type { Sensor } from '@/types';

interface Props {
  sensor: Sensor | null
}

const props = defineProps<Props>()
</script>

<template>
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                        </path>
                    </svg>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Sensor Measurements</h3>
                    <p class="text-sm text-gray-500">Real-time displacement monitoring</p>
                </div>
            </div>

            <div v-if="props.sensor" class="flex items-center space-x-3">
                <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ props.sensor.name }}</p>
                    <p class="text-xs text-gray-500">{{ props.sensor.id }}</p>
                </div>
            </div>

            <div v-else
                class="flex items-center space-x-2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-200">
                <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                <span class="text-xs font-medium text-gray-500">NO SENSOR</span>
            </div>
        </div>
    </div>
</template>

<style scoped></style>