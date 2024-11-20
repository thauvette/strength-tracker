import { useEffect, useRef, useState } from 'preact/hooks';
import Big from 'big.js';
import useDB from '../../context/db/db';
import { BioEntry, BioMetric } from '../../context/db/types';
import LoadingSpinner from '../LoadingSpinner';
import DateRangePicker from '../DateRangePicker';
import dayjs from 'dayjs';

interface Props {
  id: number;
}

interface State {
  loading: boolean;
  data: null | BioMetric;
  entries: null | BioEntry[];
  error: string | null;
}

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
const exportOptions = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'averages',
    label: 'Daily Averages',
  },
];

const generateDaysFromData = (days) => {
  let minDay;
  let maxDay;

  days.forEach((day) => {
    if (!minDay || dayjs(day).isBefore(minDay)) {
      minDay = day;
    }
    if (!maxDay || dayjs(day).isAfter(maxDay)) {
      maxDay = day;
    }
  });
  return generateDaysFromRange(minDay, maxDay);
};

const generateDaysFromRange = (start, end) => {
  const diff = dayjs(end).diff(dayjs(start), 'days');

  return Array.from({ length: diff + 1 }, (_, index) =>
    dayjs(start).add(index, 'days').format('YYYY-MM-DD'),
  );
};

const Sync = ({ id }: Props) => {
  const { getAllBioById } = useDB();
  const [state, setState] = useState<State>({
    loading: true,
    data: null,
    entries: null,
    error: null,
  });
  const [dateRange, setDateRange] = useState('all');
  const [exportType, setExportType] = useState('all');
  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [includeEmptyDays, setIncludeEmptyDays] = useState(true);
  const downloadBtnRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    getAllBioById(id)
      .then((res: { data: BioMetric; entries: BioEntry[] }) => {
        setState({
          loading: false,
          data: res?.data || null,
          entries: res?.entries || null,
          error: null,
        });
      })
      .catch((err: Error) => {
        setState({
          loading: false,
          data: null,
          entries: null,
          error: err.message,
        });
      });
  }, []); // eslint-disable-line

  const { data, entries, loading, error } = state;
  if (loading) {
    return (
      <div class="flex justify-center pt-4">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div class="pt-4">
        <p>{error}</p>
      </div>
    );
  }
  const start = dayjs(customDates.startDate).startOf('day').toDate().getTime();
  const end = dayjs(customDates.endDate).endOf('day').toDate().getTime();
  const reducedData = entries.reduce(
    (obj, entry) => {
      if (
        dateRange === 'custom' &&
        !(entry.created >= start && entry.created <= end)
      ) {
        return obj;
      }

      const dayKey = dayjs(entry.date).format('YYYY-MM-DD');

      const current = obj.items[dayKey] || {
        entries: [],
        average: 0,
        count: 0,
      };
      const value = new Big(current.average)
        .plus(+entry.value)
        .div(current.count + 1);

      return {
        ...obj,
        items: {
          ...obj.items,
          [dayKey]: {
            entries: [...current.entries, entry],
            average: value.toNumber().toFixed(2),
            count: current.count + 1,
          },
        },
        count: obj.count + 1,
      };
    },
    {
      items: {},
      count: 0,
    },
  );
  const renderDownLoadData = () => {
    const dateKeysFromData = Object.keys(reducedData.items);
    const dayKeys = includeEmptyDays
      ? dateRange === 'custom'
        ? generateDaysFromRange(customDates.startDate, customDates.endDate)
        : generateDaysFromData(dateKeysFromData)
      : dateKeysFromData;
    if (exportType === 'averages') {
      const averagesData = dayKeys
        .map((key) => {
          const data = reducedData?.items?.[key];
          return `${key},${data?.average || ''}`;
        })
        .join('\n');
      return `date,average ${state.data.name}\n${averagesData}`;
    }

    const headers = ['date', state.data.name].join(',');
    const rowsCsv = dayKeys
      ?.reduce((arr, dayKey) => {
        const entries = reducedData?.items?.[dayKey]?.entries;
        if (entries?.length) {
          entries.forEach((entry) => {
            arr.push(`${entry.date},${entry.value}`);
          });
        } else {
          arr.push(`${dayKey},`);
        }
        return arr;
      }, [])
      ?.join('\n');

    return `${headers}\n${rowsCsv}`;
  };

  const handleExport = () => {
    const data = renderDownLoadData();
    downloadBtnRef.current.href = `data:text/csv;charset=utf-8, ${encodeURI(
      data,
    )}`;
    downloadBtnRef.current.download = `${state.data.name}${
      exportType === 'averages' ? ' (averages)' : ''
    } export`;
    downloadBtnRef.current.click();
  };
  return (
    <div class="pt-4">
      <h1>Sync {data?.name || ''}</h1>

      <div class="flex flex-wrap gap-2 my-4">
        <label>
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
        <label>
          <p>Export options</p>
          <select
            onInput={(e) => {
              if (e.target instanceof HTMLSelectElement) {
                setExportType(e.target.value);
              }
            }}
          >
            {exportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label class="flex items-center gap-2">
        <input
          type="checkbox"
          checked={includeEmptyDays}
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              setIncludeEmptyDays(e.target.checked);
            }
          }}
        />
        <p>Include empty days</p>
      </label>
      {dateRange === 'custom' && (
        <div class="mb-4">
          <DateRangePicker
            startDate={customDates.startDate}
            endDate={customDates.endDate}
            onChangeDate={(dates) => {
              setCustomDates(dates);
            }}
          />
        </div>
      )}

      <p class="text-lg mb-4">{reducedData?.count} entries found</p>
      {reducedData?.count > 0 && (
        <div class="flex gap-2 flex-wrap">
          <button class="btn primary" onClick={handleExport}>
            Export
          </button>
        </div>
      )}
      {/* eslint-disable-next-line */}
      <a class="hidden" ref={downloadBtnRef} target="_blank" />
    </div>
  );
};

export default Sync;
