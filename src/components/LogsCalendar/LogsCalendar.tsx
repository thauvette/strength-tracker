import { h } from 'preact';
import { useCallback, useEffect, useReducer } from 'preact/hooks';
import { logsCalendarReducer } from './logsCalendarReducer';
import Calendar from '../calendar/Calendar';
import dayjs, { Dayjs } from 'dayjs';
import useDB from '../../context/db/db';

interface Props {
  initialDate?: Date;
  selectDate: (day: Dayjs) => void;
}

const LogsCalendar = ({ initialDate = new Date(), selectDate }: Props) => {
  const { getSetsByDateRange } = useDB();
  const [data, dispatch] = useReducer(logsCalendarReducer, {});

  const renderDay = (day: Dayjs, isCurrentMonth: boolean) => {
    const monthKey = day.startOf('month').format('YYYY-MM-DD');

    const isLoading = data[monthKey]?.loading;
    const isToday = day.isSame(dayjs(), 'day');
    let classNames = isCurrentMonth ? '' : 'bg-gray-100 dark:bg-gray-900';
    const dayData = data[monthKey]?.data?.[day.format('YYYY-MM-DD')];
    const hasData = !!dayData;

    const groupString = hasData
      ? Array.from(
          new Set(
            dayData.map((exercise) =>
              exercise.primaryMuscleGroup?.name?.substring(0, 1),
            ),
          ),
        )
      : null;

    if (isToday) {
      classNames = 'bg-highlight-200 dark:text-black';
    } else if (hasData && isCurrentMonth) {
      classNames = 'bg-blue-100 dark:bg-blue-900';
    }
    return (
      <div class={`text-center ${isLoading ? 'animate-pulse' : ''}`}>
        <button
          onClick={() => selectDate(day)}
          class={`w-full h-full ${classNames}`}
        >
          {day.format('D')}
          {groupString && <p class={'text-xs m-0'}>{groupString.join(',')}</p>}
        </button>
      </div>
    );
  };

  const handleDateChange = useCallback(
    (target: Dayjs) => {
      const startDay = target.startOf('month');
      const start = startDay.toDate();
      const end = target.endOf('month').toDate();
      const key = target.startOf('month').format('YYYY-MM-DD');

      if (!data[key]) {
        dispatch({
          type: 'FETCH_DATA',
          payload: {
            date: key,
          },
        });
        getSetsByDateRange(start, end).then((res) => {
          dispatch({
            type: 'RECEIVE_DATA',
            payload: {
              date: key,
              data: res.reduce((obj, set) => {
                const key = dayjs(set.created).format('YYYY-MM-DD');
                const currentSets = obj[key] || [];
                currentSets.push(set);
                return {
                  ...obj,
                  [key]: currentSets,
                };
              }, {}),
            },
          });
        });
      }
    },
    [data, getSetsByDateRange],
  );

  useEffect(() => {
    handleDateChange(dayjs(initialDate));
  }, [initialDate, handleDateChange]);

  const onMonthChange = ({ target }: { target: Dayjs }) => {
    // check data for month and dispatch
    handleDateChange(target);
  };

  return (
    <Calendar
      startDate={initialDate}
      renderDay={renderDay}
      onMonthChange={onMonthChange}
    />
  );
};

export default LogsCalendar;
