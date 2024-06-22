import { h } from 'preact';
import { useState } from 'react';
import dayjs from 'dayjs';
import { renderChartData } from './utils';
import LineChart from '../async/LineChart';
import Icon from '../icon/Icon';
import { formatToFixed } from '../../utilities.js/formatNumbers';

const altChartTypes = {
  maxWeight: {
    label: 'Max Weight',
    chartLabel: 'Max Weight',
  },
  maxEORM: {
    label: 'Estimated One Rep Max',
    chartLabel: 'ORM',
  },
  maxSingleSetVol: {
    label: 'Single Set Vol',
    chartLabel: 'SSV',
  },
};

const renderTooltipData = ({ chartType, activeData }) => {
  if (chartType === 'vol') {
    return [
      dayjs(activeData.x).format('MMM DD'),
      `${activeData?.data?.filter((item) => !item.isWarmUp)?.length} sets`,
      `vol: ${formatToFixed(activeData.y)}`,
    ];
  }

  return [
    `${dayjs(activeData.x).format("MMM DD 'YY")}`,
    `${altChartTypes[chartType].chartLabel}: ${formatToFixed(activeData.y)}`,
    `reps: ${activeData?.[chartType]?.reps}`,
    `weight: ${activeData?.[chartType]?.weight}`,
    `bw: ${activeData?.[chartType]?.bw}`,
  ];
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
            {Object.entries(altChartTypes).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
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
            renderTooltipText={(activeData) =>
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
