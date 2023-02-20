import { h } from 'preact'
import { useState } from 'preact/hooks'
import LineChart from '../async/LineChart'
import { renderData } from './utils'
import Icon from '../../components/icon/Icon'

const Charts = ({ days }) => {
  const [chartSpan, setChartSpan] = useState('all')
  const [chartGrouping, setChartGrouping] = useState('day')

  const [activeChunk, setActiveChunk] = useState(0)

  // array of {title: items: [{x: getTime format, y: value}]}
  const data = renderData({ days, timeSpan: chartSpan, chartGrouping })

  return (
    <div>
      <h2 class="my-2">Charts</h2>
      <label>
        <p>Grouped by...</p>
        <select
          value={chartGrouping}
          onInput={(e) => {
            setChartGrouping(e.target.value)
            setActiveChunk(0)
          }}
          class="mb-4 w-full"
        >
          <option value="day">Days</option>
          <option value="week">Week</option>
        </select>
      </label>
      <label>
        <p>Time frame</p>
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
          <option value="4 weeks">4 weeks</option>
          <option value="6 weeks">6 weeks</option>
          <option value="8 weeks">8 weeks</option>
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
        </select>
      </label>
      <div class="flex items-center justify-between py-4">
        {data?.length > 1 ? (
          <button
            class={`${activeChunk + 1 >= data.length ? 'opacity-50' : ''}`}
            disabled={activeChunk + 1 >= data.length}
            onClick={() => setActiveChunk(activeChunk + 1)}
            aria-label="Previous"
          >
            <Icon name="arrow-back-outline" />
          </button>
        ) : null}
        <div class="text-center flex-1">
          {data?.[activeChunk]?.title && (
            <h2 class="">{data?.[activeChunk]?.title}</h2>
          )}
          {data?.[activeChunk]?.subTitle && (
            <h3 class="">{data?.[activeChunk]?.subTitle}</h3>
          )}
        </div>
        {data?.length > 1 ? (
          <button
            class={`${!activeChunk ? 'opacity-50' : ''} `}
            disabled={!activeChunk}
            onClick={() => setActiveChunk(activeChunk - 1)}
          >
            <Icon name="arrow-forward-outline" />
          </button>
        ) : null}
      </div>

      {data?.[activeChunk]?.items && (
        <div class="pb-8">
          <LineChart
            key={`${chartSpan}-${activeChunk}-${chartGrouping}`}
            dateFormat={data?.[activeChunk]?.dateFormat}
            data={data?.[activeChunk]?.items}
          />
        </div>
      )}
    </div>
  )
}

export default Charts
