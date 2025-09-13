<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import Plotly from 'plotly.js-dist-min'
import type { Sensor, MeasurementResponse } from '../types'
import { fetchMeasurements } from '../api/mockApis'

interface Props {
  sensor: Sensor | null
}

const props = defineProps<Props>()

const chartContainer = ref<HTMLDivElement>()
const measurements = ref<MeasurementResponse | null>(null)
const loading = ref(false)
const chartCreated = ref(false)

const clearChart = () => {
  if (chartContainer.value && chartCreated.value) {
    try {
      Plotly.purge(chartContainer.value)
      chartCreated.value = false
    } catch (error) {
      console.error('Error clearing chart:', error)
    }
  }
}

const loadMeasurements = async (sensorId: string) => {
  loading.value = true
  clearChart()
  measurements.value = null

  try {
    const data = await fetchMeasurements(sensorId)
    
    measurements.value = data
    loading.value = false
    
    await nextTick()
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (chartContainer.value) {
      await createChart()
    } else {
      console.error('Chart container still not available')
    }
    
  } catch (error) {
    console.error('Error loading measurements:', error)
    loading.value = false
  }
}

watch(() => props.sensor, async (newSensor) => {
  if (newSensor) {
    await loadMeasurements(newSensor.id)
  } else {
    clearChart()
    measurements.value = null
  }
}, { immediate: true })

const createChart = async () => {

  if (!chartContainer.value || !measurements.value || !props.sensor) {
    console.log('Chart creation skipped - missing requirements')
    return
  }

  try {
    const { measurements: data } = measurements.value
    const threshold = props.sensor.threshold
    
    const timestamps = data.map(m => m.timestamp)
    const values = data.map(m => m.disp_mm)
    
    const traces = [
      {
        x: timestamps,
        y: values,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Displacement',
        line: { color: '#3B82F6' },
        marker: { size: 4 }
      },
      {
        x: [timestamps[0], timestamps[timestamps.length - 1]],
        y: [threshold, threshold],
        type: 'scatter',
        mode: 'lines',
        name: 'Threshold',
        line: { color: '#EF4444', dash: 'dash', width: 2 }
      }
    ]
    
    const layout = {
      title: `${props.sensor.name} - Displacement Over Time`,
      xaxis: { title: 'Time' },
      yaxis: { title: 'Displacement (mm)' },
      margin: { t: 50, r: 50, b: 50, l: 50 },
      height: 400,
      autosize: true
    }
    
    const config = {
      responsive: true,
      displayModeBar: false
    }
    
    await Plotly.newPlot(chartContainer.value, traces, layout, config)
    chartCreated.value = true
  } catch (error) {
    console.error('Error creating chart:', error)
  }
}

onUnmounted(() => {
  clearChart()
})
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div v-if="!props.sensor" class="text-center text-gray-500 py-8">
      <p>Select a sensor to view its measurements</p>
    </div>
    
    <div v-else-if="loading" class="text-center py-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-gray-500">Loading measurements for {{ props.sensor.name }}...</span>
      </div>
    </div>
    
    <div v-else-if="measurements" class="w-full">
      <h2 class="mb-2 text-green-600">{{ props.sensor.name }}</h2>
      <div 
        ref="chartContainer" 
        class="w-full h-96 bg-gray-50 border-2 border-green-200 rounded"
        style="min-height: 400px;"
      >
        <div class="flex items-center justify-center h-full text-gray-400">
        </div>
      </div>
    </div>
    
    <div v-else class="text-center text-red-500 py-8">
      <p>No measurements data available</p>
      <p class="text-xs">sensor: {{ !!props.sensor }}, loading: {{ loading }}, measurements: {{ !!measurements }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>