import { h } from 'preact'
import { useState } from 'preact/hooks'
import LineChart from '../../components/Charts/LineCharts/LineChart'
import { renderData } from './utils'
import Icon from '../../components/icon/Icon'

const Charts = ({ days }) => {
  const [chartSpan, setChartSpan] = useState('all')
  const [activeChunk, setActiveChunk] = useState(0)

  // array of {title: items: [{x: getTime format, y: value}]}
  const data = renderData({ days, displayGroup: chartSpan })

  return (
    <div>
      <h2 class="my-2">Charts</h2>
      <select
        value={chartSpan}
        onInput={(e) => {
          setChartSpan(e.target.value)
          setActiveChunk(0)
        }}
        class="mb-4 w-full"
      >
        <option value="all">All Time</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="6 weeks">6 weeks</option>
        <option value="8 weeks">8 weeks</option>
      </select>
      {data?.length > 1 ? (
        <div class="flex items-center justify-between py-4">
          <button
            class={`${activeChunk + 1 >= data.length ? 'opacity-50' : ''}`}
            disabled={activeChunk + 1 >= data.length}
            onClick={() => setActiveChunk(activeChunk + 1)}
            aria-label="Previous"
          >
            <Icon name="arrow-back-outline" />
          </button>
          {data?.[activeChunk]?.title && (
            <h2 class="flex-1 text-center">{data?.[activeChunk]?.title}</h2>
          )}
          <button
            class={`${!activeChunk ? 'opacity-50' : ''} `}
            disabled={!activeChunk}
            onClick={() => setActiveChunk(activeChunk - 1)}
          >
            <Icon name="arrow-forward-outline" />
          </button>
        </div>
      ) : null}

      {data?.[activeChunk]?.items && (
        <div class="pb-8">
          <LineChart
            key={`${chartSpan}-${activeChunk}`}
            dateFormat={data?.[activeChunk]?.dateFormat}
            data={data?.[activeChunk]?.items}
          />
        </div>
      )}
    </div>
  )
}

export default Charts
