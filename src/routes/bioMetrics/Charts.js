import { h } from 'preact'
import { useState } from 'preact/hooks'
import LineChart from '../../components/Charts/LineCharts/LineChart'
import { renderData } from './utils'

const Charts = ({ days }) => {
  const [chartSpan, setChartSpan] = useState('all')
  const [activeChunk, setActiveChunk] = useState(0)

  // array of {title: items: [{x: getTime format, y: value}]}
  const data = renderData({ days, displayGroup: chartSpan })

  return (
    <div>
      <h2>Charts</h2>
      <select
        value={chartSpan}
        onInput={(e) => {
          setChartSpan(e.target.value)
          setActiveChunk(0)
        }}
      >
        <option value="all">All Time</option>
        <option value="weeks">Weeks</option>
        <option value="months">Months</option>
      </select>
      {data?.length > 1 ? (
        <div class="flex items-center justify-between">
          <button
            class="disabled:opacity-50"
            disabled={activeChunk + 1 >= data.length}
            onClick={() => setActiveChunk(activeChunk + 1)}
          >
            Prev
          </button>
          <button
            class="disabled:opacity-50"
            disabled={!activeChunk}
            onClick={() => setActiveChunk(activeChunk - 1)}
          >
            Next
          </button>
        </div>
      ) : null}
      {data?.[activeChunk]?.title && <h2>{data?.[activeChunk]?.title}</h2>}
      {data?.[activeChunk]?.items && (
        <LineChart
          key={`${chartSpan}-${activeChunk}`}
          dateFormat={data?.[activeChunk]?.dateFormat}
          data={data?.[activeChunk]?.items}
        />
      )}
    </div>
  )
}

export default Charts
