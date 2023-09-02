import { h } from 'preact';
import { useState } from 'react';
import { renderChartData } from './utils';
import LineChart from '../async/LineChart';
import Icon from '../icon/Icon';
import { formatToFixed } from '../../utilities.js/formatNumbers';
import dayjs from 'dayjs';

const renderTooltipData = ({ chartType, activeData }) => {
  if (chartType === 'vol') {
    return (
      <div class="text-white text-center">
        <p>{dayjs(activeData.x).format('MMM DD')}</p>
        <p>{activeData?.data?.filter((item) => !item.isWarmUp)?.length} sets</p>
        <p>vol: {formatToFixed(activeData.y)}</p>
      </div>
    );
  }

  return (
    <div>
      <p class="text-white text-center">{formatToFixed(activeData.y)}</p>
      <p>reps: {activeData?.[chartType]?.reps}</p>
      <p>weight: {activeData?.[chartType]?.weight}</p>
      <p>bw: {activeData?.[chartType]?.bw}</p>
    </div>
  );
};

const Charts = ({ exerciseHistory, includeBwInHistory = false }) => {
  const [chartType, setChartType] = useState('vol');
  const [timeSpan, setTimeSpan] = useState('all');
  const [activeChunk, setActiveChunk] = useState(0);

  const data = renderChartData({
    chartType,
    timeSpan,
    exerciseHistory,
    includeBwInHistory,
  });

  const chartData = data?.[activeChunk]?.data;

  const showArrows = data?.length > 1;
  const title = data?.[activeChunk]?.title;
  return (
    <div>
      <h1>Charts</h1>
      <div class="flex gap-2 items-center justify-between">
        <div class="flex-1">
          <label class="block" htmlFor="chartType">
            Metric
          </label>
          <select
            class="w-full"
            id="chartType"
            onInput={(e) => {
              setChartType(e.target.value);
              setActiveChunk(0);
            }}
            value={chartType}
          >
            <option value="vol">Volume</option>
            <option value="maxWeight">Max Weight</option>
            <option value="maxEORM">Estimated One Rep Max</option>
            <option value="maxSingleSetVol">Single Set Vol</option>
          </select>
        </div>

        <div class="flex-1">
          <label class="block" htmlFor="timeSpan">
            Time
          </label>
          <select
            class="w-full"
            id="timeSpan"
            onInput={(e) => {
              setTimeSpan(e.target.value);
              setActiveChunk(0);
            }}
            value={timeSpan}
          >
            <option value="all">All Time</option>
            <option value="1 years">year</option>
            <option value="1 months">Month</option>
            <option value="4 weeks">4 Weeks</option>
            <option value="6 weeks">6 Weeks</option>
            <option value="8 weeks">8 Weeks</option>
            <option value="3 months">3 Months</option>
            <option value="6 months">6 Months</option>
          </select>
        </div>
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
  );
};

export default Charts;
