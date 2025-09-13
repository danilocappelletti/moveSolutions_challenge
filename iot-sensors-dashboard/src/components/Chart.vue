<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import Plotly from 'plotly.js-dist-min'
import type { Sensor, MeasurementResponse } from '../types'
import { fetchMeasurements } from '../api/mockApis'
import ChartInfo from './chartComponents/ChartInfo.vue'
import ChartLoader from './chartComponents/ChartLoader.vue'
import ChartEmpty from './chartComponents/ChartEmpty.vue'
import ChartHeader from './chartComponents/ChartHeader.vue'

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
    
    const measurementTrace = {
      x: timestamps,
      y: values,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Displacement',
      line: { color: '#3B82F6', width: 2 },
      marker: { 
        size: 6, 
        color: values.map(val => val > threshold ? '#EF4444' : '#10B981'), 
        line: { width: 1, color: '#ffffff' }
      }
    }
    
    const thresholdTrace = {
      x: [timestamps[0], timestamps[timestamps.length - 1]],
      y: [threshold, threshold],
      type: 'scatter',
      mode: 'lines',
      name: 'Threshold',
      line: { color: '#F59E0B', dash: 'dash', width: 3 }
    }
    
    const traces = [measurementTrace, thresholdTrace]
    
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
   <ChartHeader :sensor="props.sensor" />
    <!-- Content -->
    <div class="p-6">
      <!-- No sensor selected -->
      <div v-if="!props.sensor" class="text-center py-12">
        <ChartEmpty />
      </div>
      
      <!-- Loading -->
      <div v-else-if="loading" class="text-center py-12">
        <ChartLoader :sensor="props.sensor" />
      </div>
      
      <!-- Chart -->
      <div v-else-if="measurements" class="w-full">
        <div ref="chartContainer" class="w-full h-96 rounded-lg"></div>
        <!-- Chart info -->
        <ChartInfo :sensor="props.sensor" :measurements="measurements" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>