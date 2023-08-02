import { h } from 'preact'
import dayjs from 'dayjs'
import { useEffect, useState } from 'preact/hooks'
import { Link, route } from 'preact-router'
import useDB from '../context/db/db'
import { objectStores } from '../context/db/config'

import Modal from '../components/modal/Modal'
import Calendar from '../components/calendar/Calendar'
import { routes } from '../config/routes'

import dateFormats from '../config/dateFormats'
import Icon from '../components/icon/Icon'
import useSessionContext from '../context/sessionData/sessionData'
import Body from '../components/async/body'
import { uniq } from 'lodash'
import CalendarControls from '../components/logs/calendarControls'
import LogGroup from '../components/logs/logGroup'
import LogSet from '../components/logs/logSet'

// date is a query param
const Logs = ({ date }) => {
  const { getAllSetsHistory, getAllEntries } = useDB()

  const { startRoutine } = useSessionContext()

  const [logState, setLogState] = useState({
    loading: true,
    data: null,
    error: null,
    bioMetrics: null,
  })

  const [activeDate, setActiveDate] = useState(
    date || dayjs().format(dateFormats.day),
  )
  const [calendarIsOpen, setCalendarIsOpen] = useState(false)

  const [view, setView] = useState('groups')

  const [selectedExercise, setSelectedExercise] = useState(null)

  const changeDate = (date) => {
    setActiveDate(date)
    route(`${routes.logs}?date=${date}`)
  }

  useEffect(() => {
    if (date && date !== activeDate) {
      changeDate(date)
    }
  }, [date, activeDate])

  const getData = () => {
    const promises = [
      getAllSetsHistory(),
      getAllEntries(objectStores.bioMetrics),
      getAllEntries(objectStores.bioEntries),
    ]

    return Promise.all(promises).then(
      ([logsRes, bioMetricsRes, bioEntriesRes]) => {
        const bioData = Object.values(bioEntriesRes || {}).reduce(
          (obj, entry) => {
            const dayKey = dayjs(entry.date).format(dateFormats.day)

            const currentDayData = obj[dayKey] || {}
            const bioName =
              bioMetricsRes[entry.bioMetric]?.name || entry.bioMetric
            const id = entry.bioMetric
            const currentEntries = currentDayData[id] || {
              name: bioName,
              bioId: entry.bioMetric,
              items: [],
            }

            currentEntries.items.push(entry)

            return {
              ...obj,
              [dayKey]: {
                ...currentDayData,
                [id]: currentEntries,
              },
            }
          },
          {},
        )

        setLogState({
          loading: false,
          error: null,
          data: logsRes,
          bioMetrics: bioData,
        })
      },
    )
  }

  useEffect(() => {
    getData()
  }, []) // eslint-disable-line

  if (logState.loading) {
    return (
      <div>
        <p>Loading</p>
      </div>
    )
  }
  if (logState.error) {
    return (
      <div>
        <p>{logState.error}</p>
      </div>
    )
  }
  const activeDayData = logState.data?.[activeDate] || []
  const sortedDayData = activeDayData.reduce((obj, exercise) => {
    const key = exercise.name

    const currentExerciseSets = obj[key] || []
    currentExerciseSets.push(exercise)
    return {
      ...obj,
      [key]: currentExerciseSets,
    }
  }, {})

  const stepByDate = (amount) =>
    changeDate(dayjs(activeDate).add(amount, 'days').format(dateFormats.day))

  const toggleCalendar = () => setCalendarIsOpen(!calendarIsOpen)

  const selectDate = (date) => {
    changeDate(date.format(dateFormats.day))
    setCalendarIsOpen(false)
  }

  const isToday = dayjs(activeDate).isSame(dayjs(), 'day')
  const useDayAsRoutine = () => {
    const sets =
      activeDayData?.map(
        ({ exercise, name, reps, weight, isWarmUp, barWeight }) => ({
          exercise,
          exerciseName: name,
          reps,
          weight,
          isWarmUp,
          barWeight: barWeight || 45,
        }),
      ) || []
    startRoutine(sets)
    route(routes.activeRoutine)
  }

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
          ])

          const activeSecondary = uniq([
            ...obj.activeSecondary,
            ...(set.secondaryMusclesWorked || []),
          ])
          return {
            activePrimary,
            activeSecondary,
          }
        },
        {
          activePrimary: [],
          activeSecondary: [],
        },
      ) || {
        activePrimary: [],
        activeSecondary: [],
      }

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
          <div class="px-8 pb-4">
            <div class="flex items-center justify-center gap-4 pb-4 text-lg">
              <p class="capitalize">{selectedExercise?.name || 'Workout'}</p>
              {selectedExercise ? (
                <button class="p-0" onClick={() => setSelectedExercise(null)}>
                  X
                </button>
              ) : null}
            </div>
            <Body {...musclesWorked} />
          </div>
          <div class="flex justify-between pb-6">
            <button
              class="link underline"
              onClick={() => setView(view === 'groups' ? 'order' : 'groups')}
            >
              {view === 'groups' ? 'View in Order' : 'View in Groups'}
            </button>
            {!isToday && (
              <button class="hollow" onClick={useDayAsRoutine}>
                Do workout
              </button>
            )}
          </div>
        </>
      ) : null}

      {view === 'groups'
        ? Object.entries(sortedDayData).map(([name, sets]) => (
            <LogGroup
              key={name}
              name={name}
              sets={sets}
              toggleActive={() =>
                setSelectedExercise(
                  selectedExercise?.exercise === sets?.[0].exercise
                    ? null
                    : sets?.[0],
                )
              }
            />
          ))
        : activeDayData?.map((set) => (
            <LogSet
              key={set.created}
              set={set}
              toggleActive={() =>
                setSelectedExercise(
                  selectedExercise?.exercise === set.exercise ? null : set,
                )
              }
            />
          ))}

      {logState?.bioMetrics?.[activeDate] ? (
        <div>
          <h1 class="my-4">Bio metrics</h1>
          {Object.entries(logState?.bioMetrics?.[activeDate]).map(
            ([id, bioMetric]) => (
              <div key={id} class="mb-4 card p-4">
                <div class="flex items-center justify-between">
                  <p class="font-bold capitalize">{bioMetric.name}</p>
                  <div class="flex justify-end">
                    <Link href={`${routes.bioMetricsBase}/${bioMetric.bioId}`}>
                      View
                    </Link>
                  </div>
                </div>
                {bioMetric.items?.length
                  ? bioMetric.items.map((item) => (
                      <div key={item.created}>
                        <p>
                          {dayjs(item.date).format(dateFormats.time)} -{' '}
                          {item.value}
                        </p>
                      </div>
                    ))
                  : null}
              </div>
            ),
          )}
        </div>
      ) : null}
      <Modal isOpen={calendarIsOpen} onRequestClose={toggleCalendar}>
        <Calendar
          startDate={activeDate}
          renderDay={(day, isCurrentMonth) => {
            const isToday = day.isSame(dayjs(), 'day')
            const dayData = logState.data?.[day.format(dateFormats.day)]
            const hasData = !!dayData?.length
            const groupString = hasData
              ? Array.from(
                  new Set(
                    dayData.map((exercise) =>
                      exercise.primaryGroupName?.substring(0, 1),
                    ),
                  ),
                )
              : null

            let classNames = isCurrentMonth
              ? ''
              : 'bg-gray-100 dark:bg-gray-900'
            if (isToday) {
              classNames = 'bg-highlight-200 dark:text-black'
            } else if (hasData && isCurrentMonth) {
              classNames = 'bg-blue-100 dark:bg-blue-900'
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
            )
          }}
        />
      </Modal>
    </div>
  )
}

export default Logs
