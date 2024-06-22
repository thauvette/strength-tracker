import dayjs from 'dayjs';
import { useRef, useState } from 'preact/hooks';
import DateRangePicker from '../DateRangePicker';

const rangeOptions = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
];

interface Props {
  data: {
    bw: number;
    created: number;
    exercise: number;
    id: number;
    reps: number;
    weight: number;
    isWarmUp?: boolean;
  }[];
  name: string;
}

const rows = [
  { key: 'exercise', header: 'exercise id' },
  { key: 'id', header: 'set id' },
  { key: 'created', header: 'date' },
  { key: 'reps', header: 'reps' },
  { key: 'weight', header: 'weight' },
  { key: 'isWarmUp', header: 'warmp up set' },
  { key: 'bw', header: 'body weight' },
];

const Sync = ({ data, name }: Props) => {
  const [dateRange, setDateRange] = useState('all');
  const [includeWarmUpSets, setIncludeWarmUpSets] = useState(true);
  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: '',
  });

  const downloadBtnRef = useRef(null);

  const start = dayjs(customDates.startDate).startOf('day').toDate().getTime();
  const end = dayjs(customDates.endDate).endOf('day').toDate().getTime();
  const filteredData =
    dateRange === 'all' && includeWarmUpSets
      ? data
      : data.filter((item) => {
          if (!includeWarmUpSets && !!item.isWarmUp) {
            return false;
          }
          if (dateRange === 'custom') {
            return item.created >= start && item.created <= end;
          }
          return true;
        });

  const createExport = () => {
    const headers = rows.map(({ header }) => header).join(',');

    const csv = filteredData
      .map((item) =>
        rows
          .map(({ key }) => {
            if (key === 'created') {
              return dayjs(item[key]).format();
            }

            return item[key] || '';
          })
          .join(','),
      )
      .join('\n');

    const href = `data:text/csv;charset=utf-8, ${encodeURI(
      `${headers}\n${csv}`,
    )}`;
    downloadBtnRef.current.href = href;
    downloadBtnRef.current.download = `${name} export`;
    downloadBtnRef.current.click();
  };
  return (
    <div class="px-4">
      <h1>Export </h1>
      <label class="block flex flex-col">
        <p>Date range</p>
        <select
          onInput={(e) => {
            if (e.target instanceof HTMLSelectElement) {
              setDateRange(e.target.value);
            }
          }}
        >
          {rangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {dateRange === 'custom' && (
        <div class="my-4">
          <DateRangePicker
            startDate={customDates.startDate}
            endDate={customDates.endDate}
            onChangeDate={(dates) => {
              setCustomDates(dates);
            }}
          />
        </div>
      )}

      <label class="flex gap-2 items-center">
        <input
          type="checkbox"
          class="w-[20px] h-[20px]"
          checked={includeWarmUpSets}
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              setIncludeWarmUpSets(e.target.checked);
            }
          }}
        />
        <p class="text-lg">Include warm up sets</p>
      </label>

      <p class="mb-4">{filteredData?.length} items found</p>
      <button
        class="primary"
        onClick={createExport}
        disabled={!filteredData?.length}
      >
        Export CSV
      </button>
      {/* eslint-disable-next-line */}
      <a class="hidden" ref={downloadBtnRef} target="_blank" />
    </div>
  );
};

export default Sync;
