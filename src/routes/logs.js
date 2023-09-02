import { h } from 'preact';
import dayjs from 'dayjs';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { uniq } from 'lodash';
import useDB from '../context/db/db.tsx';
import { objectStores } from '../context/db/config.ts';

import Modal from '../components/modal/Modal';
import Calendar from '../components/calendar/Calendar';
import { routes } from '../config/routes';

import dateFormats from '../config/dateFormats';

import CalendarControls from '../components/logs/calendarControls';

import LoadingSpinner from '../components/LoadingSpinner.js';
import LogHeader from '../components/logs/logHeader';
import BioMetricList from '../components/logs/bioMetricList';
import ExerciseLists from '../components/logs/exerciseLists';

// date is a query param
const Logs = ({ date }) => {
  const { getAllSetsHistory, getAllEntries } = useDB();

  const [logState, setLogState] = useState({
    loading: true,
    data: null,
    error: null,
    bioMetrics: null,
  });

  const [activeDate, setActiveDate] = useState(
    date || dayjs().format(dateFormats.day),
  );
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);

  const [selectedExercise, setSelectedExercise] = useState(null);
  const clearSelectedExercise = () => setSelectedExercise(null);

  const changeDate = (date) => {
    setActiveDate(date);
    route(`${routes.logs}?date=${date}`);
  };

  useEffect(() => {
    if (date && date !== activeDate) {
      changeDate(date);
    }
  }, [date, activeDate]);

  const getData = () => {
    const promises = [
      getAllSetsHistory(),
      getAllEntries(objectStores.bioMetrics),
      getAllEntries(objectStores.bioEntries),
    ];

    return Promise.all(promises).then(
      ([logsRes, bioMetricsRes, bioEntriesRes]) => {
        const bioData = Object.values(bioEntriesRes || {}).reduce(
          (obj, entry) => {
            const dayKey = dayjs(entry.date).format(dateFormats.day);

            const currentDayData = obj[dayKey] || {};
            const bioName =
              bioMetricsRes[entry.bioMetric]?.name || entry.bioMetric;
            const id = entry.bioMetric;
            const currentEntries = currentDayData[id] || {
              name: bioName,
              bioId: entry.bioMetric,
              items: [],
            };

            currentEntries.items.push(entry);

            return {
              ...obj,
              [dayKey]: {
                ...currentDayData,
                [id]: currentEntries,
              },
            };
          },
          {},
        );

        setLogState({
          loading: false,
          error: null,
          data: logsRes,
          bioMetrics: bioData,
        });
      },
    );
  };

  useEffect(() => {
    getData();
    addEventListener('dbSetAdded', getData);
    return () => removeEventListener('dbSetAdded', getData);
  }, []); // eslint-disable-line

  if (logState.loading) {
    return (
      <div class="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (logState.error) {
    return (
      <div>
        <p>{logState.error}</p>
      </div>
    );
  }
  const activeDayData = logState.data?.[activeDate] || [];

  const stepByDate = (amount) =>
    changeDate(dayjs(activeDate).add(amount, 'days').format(dateFormats.day));

  const toggleCalendar = () => setCalendarIsOpen(!calendarIsOpen);

  const selectDate = (date) => {
    changeDate(date.format(dateFormats.day));
    setCalendarIsOpen(false);
  };

  const isToday = dayjs(activeDate).isSame(dayjs(), 'day');

  const musclesWorked = selectedExercise
    ? {
        activePrimary: selectedExercise.musclesWorked,
        activeSecondary: selectedExercise.secondaryMusclesWorked,
      }
    : activeDayData?.reduce(
        (obj, set) => {
          const activePrimary = uniq([
            ...obj.activePrimary,
            ...(set.musclesWorked || []),
          ]);

          const activeSecondary = uniq([
            ...obj.activeSecondary,
            ...(set.secondaryMusclesWorked || []),
          ]);
          return {
            activePrimary,
            activeSecondary,
          };
        },
        {
          activePrimary: [],
          activeSecondary: [],
        },
      ) || {
        activePrimary: [],
        activeSecondary: [],
      };

  return (
    <div class="px-2">
      <CalendarControls
        isToday={isToday}
        toggleCalendar={toggleCalendar}
        stepByDate={stepByDate}
        activeDate={activeDate}
        changeDate={changeDate}
      />
      {activeDayData?.length > 0 ? (
        <>
          <LogHeader
            activeDayData={activeDayData}
            selectedExercise={selectedExercise}
            clearSelectedExercise={clearSelectedExercise}
            musclesWorked={musclesWorked}
          />
          <ExerciseLists
            activeDayData={activeDayData}
            isToday={isToday}
            toggleSelectedExercise={(set) =>
              setSelectedExercise(
                selectedExercise?.exercise === set.exercise ? null : set,
              )
            }
          />
        </>
      ) : null}

      {logState?.bioMetrics?.[activeDate] ? (
        <BioMetricList bioMetrics={logState?.bioMetrics?.[activeDate]} />
      ) : null}
      <Modal isOpen={calendarIsOpen} onRequestClose={toggleCalendar}>
        <Calendar
          startDate={activeDate}
          renderDay={(day, isCurrentMonth) => {
            const isToday = day.isSame(dayjs(), 'day');
            const dayData = logState.data?.[day.format(dateFormats.day)];
            const hasData = !!dayData?.length;
            const groupString = hasData
              ? Array.from(
                  new Set(
                    dayData.map((exercise) =>
                      exercise.primaryGroupName?.substring(0, 1),
                    ),
                  ),
                )
              : null;

            let classNames = isCurrentMonth
              ? ''
              : 'bg-gray-100 dark:bg-gray-900';
            if (isToday) {
              classNames = 'bg-highlight-200 dark:text-black';
            } else if (hasData && isCurrentMonth) {
              classNames = 'bg-blue-100 dark:bg-blue-900';
            }

            return (
              <div class={`text-center`}>
                <button
                  onClick={() => selectDate(day)}
                  class={`w-full h-full ${classNames}`}
                >
                  {day.format('D')}
                  {groupString && (
                    <p class={`text-xs m-0`}>{groupString.join(',')}</p>
                  )}
                </button>
              </div>
            );
          }}
        />
      </Modal>
    </div>
  );
};

export default Logs;
