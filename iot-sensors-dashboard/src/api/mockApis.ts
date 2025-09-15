import type { MeasurementResponse, Measurement } from '../types'

// Cache to store generated measurements
const measurementsCache: Record<string, MeasurementResponse> = {}

const generateMockMeasurements = (threshold: number): Measurement[] => {
  const measurements: Measurement[] = []
  const now = new Date()
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  
  // Generate ~100 measurements over 3 days (every ~45 minutes)
  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(threeDaysAgo.getTime() + (i * 45 * 60 * 1000))
    
    // Generate values around the threshold with some variation
    const baseValue = threshold * 0.7 // Usually below threshold
    const variation = Math.random() * threshold * 0.8 // Some random variation
    const spike = Math.random() > 0.9 ? threshold * 0.4 : 0 // Occasional spikes
    
    measurements.push({
      timestamp: timestamp.toISOString(),
      disp_mm: Math.round((baseValue + variation + spike) * 100) / 100
    })
  }
  
  return measurements
}

export const fetchMeasurements = async (sensorId: string): Promise<MeasurementResponse> => {

  await new Promise(resolve => setTimeout(resolve, 400))
  
  if (measurementsCache[sensorId]) {
    console.log(`Using cached data for ${sensorId}`)
    return measurementsCache[sensorId]
  }
  
  console.log(`Generating new data for ${sensorId}`)
  const thresholds: Record<string, number> = {
    'SEN-001': 3.5,
    'SEN-002': 2.0,
    'SEN-003': 4.0
  }
  
  const threshold = thresholds[sensorId] || 3.0
  const data = {
    sensorId,
    measurements: generateMockMeasurements(threshold)
  }
  
  measurementsCache[sensorId] = data
  
  return data
}

export const getLastValue = (sensorId: string): number => {
  const cachedData = measurementsCache[sensorId]
  if (cachedData && cachedData.measurements.length > 0) {
    const lastMeasurement = cachedData.measurements[cachedData.measurements.length - 1]
    return lastMeasurement.disp_mm
  }
  return 0
}

export const getAllLastValues = async (): Promise<Record<string, number>> => {
  const sensorIds = ['SEN-001', 'SEN-002', 'SEN-003']
  const lastValues: Record<string, number> = {}
  
  // Generate data for all sensors if not cached
  for (const sensorId of sensorIds) {
    await fetchMeasurements(sensorId)
    lastValues[sensorId] = getLastValue(sensorId)
  }
  
  return lastValues
}

export const addNewMeasurement = (sensorId: string): Measurement | null => {
  const cachedData = measurementsCache[sensorId]
  if (!cachedData) return null
  
  const thresholds: Record<string, number> = {
    'SEN-001': 3.5,
    'SEN-002': 2.0,
    'SEN-003': 4.0
  }
  
  const threshold = thresholds[sensorId] || 3.0
  const measurements = cachedData.measurements
  
  const lastTimestamp = new Date(measurements[measurements.length - 1].timestamp)
  const newTimestamp = new Date(lastTimestamp.getTime() + 45 * 60 * 1000)
  
  const baseValue = threshold * 0.7
  const variation = Math.random() * threshold * 0.8
  const spike = Math.random() > 0.92 ? threshold * 0.4 : 0
  
  const newMeasurement: Measurement = {
    timestamp: newTimestamp.toISOString(),
    disp_mm: Math.round((baseValue + variation + spike) * 100) / 100
  }
  
  measurements.push(newMeasurement)
  if (measurements.length > 100) {
    measurements.shift()
  }
  
  return newMeasurement
}

export const addNewMeasurementToAll = (): Record<string, Measurement> => {
  const sensorIds = ['SEN-001', 'SEN-002', 'SEN-003']
  const newMeasurements: Record<string, Measurement> = {}
  
  sensorIds.forEach(sensorId => {
    const newMeasurement = addNewMeasurement(sensorId)
    if (newMeasurement) {
      newMeasurements[sensorId] = newMeasurement
    }
  })
  
  return newMeasurements
}