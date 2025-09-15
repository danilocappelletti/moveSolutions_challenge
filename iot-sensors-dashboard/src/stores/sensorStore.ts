import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Sensor, Measurement } from '../types'
import { getAllLastValues, addNewMeasurementToAll, getLastValue } from '../api/mockApis'

export const useSensorStore = defineStore('sensor', () => {
  const lastValues = ref<Record<string, number>>({})
  const isLiveUpdating = ref(false)
  const updateInterval = ref<number | null>(null)
  const latestMeasurements = ref<Record<string, Measurement>>({})
  
  const getLastValueForSensor = computed(() => {
    return (sensorId: string) => lastValues.value[sensorId] || 0
  })
  
  const getSensorStatus = computed(() => {
    return (sensor: Sensor) => {
      const lastValue = lastValues.value[sensor.id] || 0
      return lastValue > sensor.threshold ? 'ALARM' : 'OK'
    }
  })
  
  const initializeData = async () => {
    const values = await getAllLastValues()
    lastValues.value = values
  }
  
  const startLiveUpdates = () => {
    if (isLiveUpdating.value) return
    
    isLiveUpdating.value = true
    updateInterval.value = setInterval(() => {
      const newMeasurements = addNewMeasurementToAll()
      latestMeasurements.value = newMeasurements
      
      Object.keys(newMeasurements).forEach(sensorId => {
        lastValues.value[sensorId] = getLastValue(sensorId)
      })
      
      console.log('Live update:', lastValues.value)
    }, 10000) 
  }
  
  const stopLiveUpdates = () => {
    if (updateInterval.value) {
      clearInterval(updateInterval.value)
      updateInterval.value = null
    }
    isLiveUpdating.value = false
  }

  const triggerManualUpdate = () => {
    console.log('triggerManualUpdate called')
    const newMeasurements = addNewMeasurementToAll()
    console.log('New measurements from API:', newMeasurements)
    latestMeasurements.value = newMeasurements
    
    Object.keys(newMeasurements).forEach(sensorId => {
      lastValues.value[sensorId] = getLastValue(sensorId)
    })
    
    console.log('Manual update triggered:', lastValues.value)
  }
  
  return {
    lastValues,
    isLiveUpdating,
    latestMeasurements,
    getLastValueForSensor,
    getSensorStatus,
    initializeData,
    startLiveUpdates,
    stopLiveUpdates,
    triggerManualUpdate
  }
})