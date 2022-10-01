import { h } from 'preact'
import dayjs from 'dayjs'
import { useEffect, useState } from 'preact/hooks'
import useDB, { objectStores } from '../../context/db/db'
import Modal from '../../components/modal/Modal'
import Calendar from '../../components/calendar/Calendar'
import { Link } from 'preact-router'
import { routes } from '../../config/routes'

import dateFormats from '../../config/dateFormats'

const Logs = () => {
  const { getAllSetsHistory, getAllEntries } = useDB()
  const [logState, setLogState] = useState({
    loading: true,
    data: null,
    error: null,
    bioMetrics: null,
  })

  const [activeDate, setActiveDate] = useState(dayjs().format(dateFormats.day))
  const [calendarIsOpen, setCalendarIsOpen] = useState(false)

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
    setActiveDate(dayjs(activeDate).add(amount, 'days').format(dateFormats.day))

  const toggleCalendar = () => setCalendarIsOpen(!calendarIsOpen)

  const selectDate = (date) => {
    setActiveDate(date.format(dateFormats.day))
    setCalendarIsOpen(false)
  }

  const isToday = dayjs(activeDate).isSame(dayjs(), 'day')

  return (
    <div class="p-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => stepByDate(-1)}
          class="text-2xl"
          ariaLabel="previous date"
        >
          <ion-icon name="arrow-back-outline" />
        </button>
        <div>
          <button
            class="m-0"
            onClick={toggleCalendar}
            ariaLabel="open calendar"
          >
            {isToday
              ? 'Today'
              : dayjs(activeDate).format(dateFormats.dayDisplay)}
          </button>
          {isToday ? null : (
            <button
              onClick={() => setActiveDate(dayjs().format(dateFormats.day))}
              ariaLabel="go to today"
              class="text-2xl"
            >
              <ion-icon name="calendar-outline" />
            </button>
          )}
        </div>
        <button
          ariaLabel="next day"
          class="text-2xl"
          onClick={() => stepByDate(1)}
        >
          <ion-icon name="arrow-forward-outline" />
        </button>
      </div>

      {Object.entries(sortedDayData).map(([name, sets]) => (
        <div key={name} class="mb-4 border-4 p-4">
          <p class="font-bold">{name}</p>
          {sets.map((set) => (
            <div key={set.created}>
              <p>
                {set.reps} @ {set.weight}
              </p>
            </div>
          ))}
          <div class="flex justify-end">
            {sets?.[0]?.exercise && (
              <Link href={`${routes.exerciseBase}/${sets[0].exercise}`}>
                View
              </Link>
            )}
          </div>
        </div>
      ))}
      {logState?.bioMetrics?.[activeDate] ? (
        <div>
          {Object.entries(logState?.bioMetrics?.[activeDate]).map(
            ([id, bioMetric]) => (
              <div key={id} class="mb-4 border-4 p-4">
                <p class="font-bold capitalize">{bioMetric.name}</p>
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
                <div class="flex justify-end">
                  <Link href={`${routes.bioMetrics}/${bioMetric.bioId}`}>
                    View
                  </Link>
                </div>
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
                      exercise.primaryGroup?.substring(0, 1),
                    ),
                  ),
                )
              : null

            let classNames = isCurrentMonth ? '' : 'bg-gray-100'
            if (isToday) {
              classNames = 'bg-green-200 '
            } else if (hasData && isCurrentMonth) {
              classNames = 'bg-blue-100'
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
