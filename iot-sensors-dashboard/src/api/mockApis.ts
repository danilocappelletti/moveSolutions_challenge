import type { MeasurementResponse, Measurement } from '../types'


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
  
  const thresholds: Record<string, number> = {
    'SEN-001': 3.5,
    'SEN-002': 2.0,
    'SEN-003': 4.0
  }
  
  const threshold = thresholds[sensorId] || 3.0
  
  return {
    sensorId,
    measurements: generateMockMeasurements( threshold)
  }
}