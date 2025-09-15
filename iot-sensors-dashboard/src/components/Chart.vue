<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import Plotly from 'plotly.js-dist-min'
import type { Sensor, MeasurementResponse } from '../types'
import { useSensorStore } from '@/stores/sensorStore'
import { fetchMeasurements } from '../api/mockApis'
import { 
  prepareChartData, 
  createChartTraces, 
  createChartLayout, 
  createChartConfig 
} from '../utils/chartConfig'

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

const sensorStore = useSensorStore()

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

const updateChartWithNewData = async () => {
  if (!chartContainer.value || !measurements.value || !props.sensor || !chartCreated.value) return

  try {
    const data = await fetchMeasurements(props.sensor.id)
    measurements.value = data
    
    const { measurements: measurementData } = data
    const threshold = props.sensor.threshold
    
    const timestamps = measurementData.map(m => m.timestamp)
    const values = measurementData.map(m => m.disp_mm)
    
    const measurementUpdate = {
      x: [timestamps],
      y: [values],
      'marker.color': [values.map(val => val > threshold ? '#EF4444' : '#10B981')]
    }
    
    const thresholdUpdate = {
      x: [[timestamps[0], timestamps[timestamps.length - 1]]],
      y: [[threshold, threshold]]
    }
    
    Plotly.restyle(chartContainer.value, measurementUpdate, [0])
    Plotly.restyle(chartContainer.value, thresholdUpdate, [1])
  } catch (err) {
    console.error('Error updating chart:', err)
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

watch(() => sensorStore.latestMeasurements, async (newMeasurements) => {
  if (props.sensor && newMeasurements[props.sensor.id] && chartCreated.value) {
    await updateChartWithNewData()
  }
}, { deep: true })

const createChart = async () => {
  if (!chartContainer.value || !measurements.value || !props.sensor) return

  try {
    const { measurements: data } = measurements.value
    
    const chartData = prepareChartData(data, props.sensor)
    const traces = createChartTraces(chartData)
    const layout = createChartLayout(props.sensor.name)
    const config = createChartConfig()
    
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