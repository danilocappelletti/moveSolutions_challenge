export interface Sensor {
  id: string
  name: string
  location: string
  threshold: number
}

export interface Measurement {
  timestamp: string
  disp_mm: number
}

export interface MeasurementResponse {
  sensorId: string
  measurements: Measurement[]
}