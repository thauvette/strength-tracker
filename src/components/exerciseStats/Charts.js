import { h } from 'preact'
import { useState } from 'react'
import { renderData } from './utils'
import LineChart from '../async/LineChart'
import Icon from '../icon/Icon'
import { formatToFixed } from '../../utilities.js/formatNumbers'
import dayjs from 'dayjs'

const renderTooltipData = ({ chartType, activeData }) => {
  if (chartType === 'vol') {
    return (
      <div class="text-white text-center">
        <p>{dayjs(activeData.x).format('MMM DD')}</p>
        <p>{activeData?.data?.filter((item) => !item.isWarmUp)?.length} sets</p>
        <p>vol: {formatToFixed(activeData.y)}</p>
      </div>
    )
  }
  return <p class="text-white text-center">{formatToFixed(activeData.y)}</p>
}

const Charts = ({ exerciseHistory, includeBwInHistory = false }) => {
  const [chartType, setChartType] = useState('vol')
  const [timeSpan, setTimeSpan] = useState('all')
  const [activeChunk, setActiveChunk] = useState(0)

  const data = renderData({
    chartType,
    timeSpan,
    exerciseHistory,
    includeBwInHistory,
  })
  const chartData = data?.[activeChunk]?.data

  const showArrows = data?.length > 1
  const title = data?.[activeChunk]?.title
  return (
    <div>
      <h1>Charts</h1>
      <div class="flex gap-2 items-center justify-between">
        <select
          class="flex-1"
          onInput={(e) => {
            setChartType(e.target.value)
            setActiveChunk(0)
          }}
          value={chartType}
        >
          <option value="vol">Volume</option>
          {/* <option value="orm">One Rep Max</option> */}
        </select>
        <select
          class="flex-1"
          onInput={(e) => {
            setTimeSpan(e.target.value)
            setActiveChunk(0)
          }}
          value={timeSpan}
        >
          <option value="all">All Time</option>
          <option value="month">Month</option>
        </select>
      </div>

      <div>
        <div class="flex items-center justify-between py-4">
          {showArrows && (
            <button
              disabled={activeChunk + 1 >= data?.length}
              class={`${activeChunk + 1 >= data?.length ? 'opacity-50' : ''}`}
              onClick={() => setActiveChunk(activeChunk + 1)}
            >
              <Icon name="arrow-back-outline" />
            </button>
          )}
          {title && <h2 class="flex-1 text-center">{title}</h2>}
          {showArrows && (
            <button
              disabled={!activeChunk}
              className={`${activeChunk ? '' : 'opacity-50'}`}
              onClick={() => setActiveChunk(activeChunk - 1)}
            >
              <Icon name="arrow-forward-outline" />
            </button>
          )}
        </div>
      </div>

      {chartData?.length > 0 ? (
        <div class="py-4">
          <LineChart
            key={`${chartType}-${timeSpan}-${activeChunk}-${
              includeBwInHistory ? '1' : '2'
            }`}
            data={chartData}
            renderTooltip={(activeData) =>
              renderTooltipData({ chartType, activeData })
            }
            dateFormat={data?.[activeChunk]?.dateFormat}
          />
        </div>
      ) : null}
    </div>
  )
}

export default Charts
