import type { Sensor, Measurement } from '../types'

export interface ChartData {
  timestamps: string[]
  values: number[]
  threshold: number
  sensorName: string
}

export const createMeasurementTrace = (data: ChartData) => {
  const { timestamps, values, threshold } = data
  
  return {
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
}

export const createThresholdTrace = (data: ChartData) => {
  const { timestamps, threshold } = data
  
  return {
    x: [timestamps[0], timestamps[timestamps.length - 1]],
    y: [threshold, threshold],
    type: 'scatter',
    mode: 'lines',
    name: 'Threshold',
    line: { color: '#F59E0B', dash: 'dash', width: 3 }
  }
}

export const createChartLayout = (sensorName: string) => {
  return {
    title: {
      text: `${sensorName} - Displacement Monitoring`,
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
}

export const createChartConfig = () => {
  return {
    responsive: true,
    displayModeBar: false
  }
}

export const prepareChartData = (
  measurements: Measurement[], 
  sensor: Sensor
): ChartData => {
  return {
    timestamps: measurements.map(m => m.timestamp),
    values: measurements.map(m => m.disp_mm),
    threshold: sensor.threshold,
    sensorName: sensor.name
  }
}

export const createChartTraces = (data: ChartData) => {
  return [
    createMeasurementTrace(data),
    createThresholdTrace(data)
  ]
}