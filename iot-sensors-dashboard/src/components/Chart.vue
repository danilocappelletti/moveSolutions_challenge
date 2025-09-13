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
  if (!chartContainer.value || !measurements.value || !props.sensor) return

  try {
    const { measurements: data } = measurements.value
    const threshold = props.sensor.threshold
    
    const timestamps = data.map(m => m.timestamp)
    const values = data.map(m => m.disp_mm)
    
    // Identify points above threshold for highlighting
    const normalPoints: { x: string[], y: number[] } = { x: [], y: [] }
    const alarmPoints: { x: string[], y: number[] } = { x: [], y: [] }
    
    data.forEach(point => {
      if (point.disp_mm > threshold) {
        alarmPoints.x.push(point.timestamp)
        alarmPoints.y.push(point.disp_mm)
      } else {
        normalPoints.x.push(point.timestamp)
        normalPoints.y.push(point.disp_mm)
      }
    })
    
    const traces = [
      {
        x: normalPoints.x,
        y: normalPoints.y,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Normal',
        line: { color: '#10B981', width: 2 },
        marker: { size: 6, color: '#10B981' }
      },
      {
        x: alarmPoints.x,
        y: alarmPoints.y,
        type: 'scatter',
        mode: 'markers',
        name: 'Above Threshold',
        marker: { size: 8, color: '#EF4444' }
      },
      {
        x: [timestamps[0], timestamps[timestamps.length - 1]],
        y: [threshold, threshold],
        type: 'scatter',
        mode: 'lines',
        name: 'Threshold',
        line: { color: '#F59E0B', dash: 'dash', width: 3 }
      }
    ]
    
    const layout = {
      title: {
        text: `${props.sensor.name} - Displacement Monitoring`,
        font: { size: 18, color: '#1F2937' }
      },
      xaxis: { 
        title: 'Time',
        gridcolor: '#F3F4F6',
        showgrid: true
      },
      yaxis: { 
        title: 'Displacement (mm)',
        gridcolor: '#F3F4F6',
        showgrid: true
      },
      margin: { t: 60, r: 50, b: 60, l: 60 },
      height: 400,
      autosize: true,
      plot_bgcolor: '#FAFAFA',
      paper_bgcolor: '#FFFFFF',
      legend: {
        orientation: 'h',
        x: 0,
        y: -0.2
      }
    }
    
    const config = {
      responsive: true,
      displayModeBar: false
    }
    
    await Plotly.newPlot(chartContainer.value, traces, layout, config)
    chartCreated.value = true
  } catch (err) {
    console.error('Error creating chart:', err)
  }
}

onUnmounted(() => {
  clearChart()
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100">
    <!-- Header -->
  <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
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
        <div class="flex items-center space-x-2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-200">
          <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span class="text-xs font-medium text-gray-700">LIVE</span>
        </div>
      </div>
      
      <div v-else class="flex items-center space-x-2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-200">
        <div class="w-2 h-2 rounded-full bg-gray-300"></div>
        <span class="text-xs font-medium text-gray-500">NO SENSOR</span>
      </div>
    </div>
  </div>

    <!-- Content -->
    <div class="p-6">
      <!-- No sensor selected -->
      <div v-if="!props.sensor" class="text-center py-12">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg style="max-height: 100px;" class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-lg">Select a sensor to view measurements</p>
        <p class="text-gray-400 text-sm mt-1">Click on any sensor in the table to see its data</p>
      </div>
      
      <!-- Loading -->
      <div v-else-if="loading" class="text-center py-12">
        <div class="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <p class="text-gray-600 text-lg">Loading measurements...</p>
        <p class="text-gray-400 text-sm mt-1">{{ props.sensor.name }}</p>
      </div>
      
      <!-- Chart -->
      <div v-else-if="measurements" class="w-full">
        <div ref="chartContainer" class="w-full h-96 rounded-lg"></div>
        
        <!-- Chart info -->
        <div class="mt-4 grid grid-cols-3 gap-4">
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <p class="text-2xl font-bold text-gray-800">{{ measurements.measurements.length }}</p>
            <p class="text-sm text-gray-600">Data Points</p>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600">{{ props.sensor.threshold }}mm</p>
            <p class="text-sm text-gray-600">Threshold</p>
          </div>
          <div class="text-center p-3 bg-blue-50 rounded-lg">
            <p class="text-2xl font-bold text-blue-600">3</p>
            <p class="text-sm text-gray-600">Days</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>