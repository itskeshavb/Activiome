import Plot from 'react-plotly.js'

/**
 * Accelerometer waveform chart — X and Z axes only, no labels, no legend.
 * Matches the original Plotly config from the PHP app exactly.
 */
export default function MotionChart({ x = [], z = [] }) {
  const indices = x.map((_, i) => i)

  const data = [
    {
      x: indices,
      y: x,
      type: 'scatter',
      mode: 'lines',
      name: 'X',
      line: { width: 1 },
    },
    {
      x: indices,
      y: z,
      type: 'scatter',
      mode: 'lines',
      name: 'Z',
      line: { width: 1 },
    },
  ]

  const layout = {
    showlegend: false,
    xaxis: { visible: false },
    yaxis: { visible: false, range: [-150, 150] },
    margin: { l: 10, r: 10, b: 10, t: 10, pad: 3 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
  }

  const config = {
    displayModeBar: false,
    responsive: true,
  }

  if (x.length === 0 && z.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    )
  }

  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
    />
  )
}
