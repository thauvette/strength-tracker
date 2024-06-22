import { h } from 'preact';
import { Link, route } from 'preact-router';
import { useEffect, useReducer, useState } from 'preact/hooks';
import dayjs from 'dayjs';
import { routes } from '../config/routes';
import CalendarControls from '../components/logs/calendarControls';
import dateFormats from '../config/dateFormats';
import LoadingSpinner from '../components/LoadingSpinner';
import useDB from '../context/db/db';
import ExerciseLists from '../components/logs/exerciseLists';
import LogHeader from '../components/logs/logHeader';
import { HydradedBioEntry, LogsSet } from '../context/db/types';
import Modal from '../components/modal/Modal';
import LogsCalendar from '../components/LogsCalendar/LogsCalendar';

interface Props {
  date?: string;
}

interface LogState {
  [key: string]: {
    loading: boolean;
    data: LogsSet[];
    bioEntries: {
      [key: string]: HydradedBioEntry;
    };
  };
}

interface ReducerActions {
  type: string;
  payload: {
    date: string;
    data?: LogsSet[];
    bioEntries?: { [key: string]: HydradedBioEntry[] };
    set?: LogsSet;
  };
}

const logsReducer = (state: LogState = {}, action: ReducerActions) => {
  switch (action.type) {
    case 'FETCH_DATE':
      return {
        ...state,
        [action.payload.date]: {
          ...(state[action.payload.date] || {}),
          loading: true,
        },
      };
    case 'RECEIVE_DAY_DATA':
      return {
        ...state,
        [action.payload.date]: {
          loading: false,
          data: action.payload?.data || [],
          bioEntries: action.payload?.bioEntries || {},
        },
      };
    case 'ADD_SINGLE_SET':
      return {
        ...state,
        [action.payload.date]: {
          ...(state[action.payload.date], {}),
          data: [
            ...(state[action.payload.date]?.data || []),
            action.payload.set,
          ],
          loading: false,
          bioEntries: state[action.payload.date]?.bioEntries,
        },
      };
    default:
      return state;
  }
};

const Home = ({ date }: Props) => {
  const { getSetsByDateRange, getBioEntriesByDateRange } = useDB();

  const [activeDate, setActiveDate] = useState(
    date || dayjs().format('YYYY-MM-DD'),
  );
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [logState, dispatch] = useReducer(logsReducer, {});
  const changeDate = (date) => {
    setActiveDate(date);
    route(`${routes.logs}?date=${date}`);
  };
  useEffect(() => {
    if (date !== activeDate) {
      changeDate(date ? date : dayjs().format('YYYY-MM-DD'));
    }
  }, [date, activeDate]);

  useEffect(() => {
    if (!logState?.[activeDate]) {
      dispatch({
        type: 'FETCH_DATE',
        payload: {
          date: activeDate,
        },
      });
      Promise.all([
        getSetsByDateRange(
          dayjs(activeDate).toDate(),
          dayjs(activeDate).toDate(),
        ),
        getBioEntriesByDateRange(activeDate, activeDate),
      ]).then(([exerciseRes, bioEntries]) => {
        dispatch({
          type: 'RECEIVE_DAY_DATA',
          payload: {
            date: activeDate,
            data: exerciseRes || [],
            bioEntries: bioEntries.reduce((obj, entry) => {
              const current = obj[entry.name] || [];
              current.push(entry);
              return {
                ...obj,
                [entry.name]: current,
              };
            }, {}),
          },
        });
      });
    }
  }, [activeDate, logState, getSetsByDateRange, getBioEntriesByDateRange]);

  useEffect(() => {
    const addSet = (event: CustomEvent) => {
      dispatch({
        type: 'ADD_SINGLE_SET',
        payload: {
          date: dayjs(event.detail.created).format('YYYY-MM-DD'),
          set: event.detail,
        },
      });
    };
    addEventListener('dbSetAdded', addSet);
    return () => removeEventListener('dbSetAdded', addSet);
  }, []);

  const { loading, data, bioEntries } = logState?.[activeDate] || {};
  const isToday = dayjs(activeDate).isSame(dayjs(), 'day');
  const stepByDate = (amount) =>
    changeDate(dayjs(activeDate).add(amount, 'days').format(dateFormats.day));

  return (
    <div class="px-2">
      <CalendarControls
        isToday={isToday}
        toggleCalendar={() => setCalendarIsOpen(true)}
        stepByDate={stepByDate}
        activeDate={activeDate}
        changeDate={changeDate}
      />
      {loading && (
        <div class="flex justify-center pb-4">
          <LoadingSpinner />
        </div>
      )}
      {data?.length > 0 ? (
        <>
          <LogHeader activeDayData={data} />
          <ExerciseLists activeDayData={data} isToday={isToday} />
        </>
      ) : null}
      {Object.keys(bioEntries || {}).length > 0 && (
        <div>
          <p class="font-bold text-lg mb-2">Bio Metrics</p>
          {Object.entries(bioEntries).map(([name, entries]) => {
            const id = entries?.[0]?.bioMetric;
            return (
              <div key={name} class="mb-4 card p-1 pl-4">
                <div class="flex justify-between font-bold capitalize pl-0">
                  <p>{name}</p>
                  <Link
                    class="underline"
                    href={`${routes.bioMetricsBase}/${id || ''}`}
                  >
                    View
                  </Link>
                </div>
                {entries.map((entry) => (
                  <div key={entry.created}>
                    <p>
                      {dayjs(entry.date).format('hh:mm a')} - {entry.value}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
      <Modal
        isOpen={calendarIsOpen}
        onRequestClose={() => setCalendarIsOpen(false)}
      >
        <LogsCalendar
          initialDate={dayjs(activeDate).toDate()}
          selectDate={(date) => {
            changeDate(date.format('YYYY-MM-DD'));
            setCalendarIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Home;
