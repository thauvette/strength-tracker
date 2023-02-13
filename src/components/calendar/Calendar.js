import dayjs from 'dayjs'
import { h } from 'preact'
import chunk from 'lodash.chunk'
import { useState } from 'preact/hooks'
import Icon from '../icon/Icon'

const Calendar = ({ startDate, renderDay }) => {
  const [start, setStart] = useState(
    dayjs(startDate || new Date()).startOf('month'),
  )

  const end = dayjs(start).endOf('month')

  const prevMonth = dayjs(start).subtract(1, 'month')

  const endOfPrevMonth = prevMonth.endOf('month').format('D')

  const firstNeededDateOfPrevMonth = +endOfPrevMonth - +start.format('d') + 1

  const firstDay = prevMonth.date(firstNeededDateOfPrevMonth)

  const paddingStart = Array.from({ length: +start.format('d') }, (_, i) =>
    firstDay.add(i, 'days'),
  )

  const days = Array.from({ length: +end.format('DD') }, (_, i) =>
    start.add(i, 'days'),
  )

  const paddingEnd = Array.from(
    { length: 6 - start.endOf('month').day() },
    (_, i) => start.endOf('month').add(i + 1, 'days'),
  )

  const weeks = chunk([...paddingStart, ...days, ...paddingEnd], 7)

  const changeMonth = (amount) => {
    setStart(start.add(amount, 'month').startOf('month'))
  }

  const printDay = (day) => {
    if (!day) return <div />
    const isCurrentMonth = day.isSame(start, 'month')
    return renderDay ? (
      renderDay(day, isCurrentMonth)
    ) : (
      <div
        class={`text-center py-2 ${
          !isCurrentMonth ? 'bg-gray-100 dark:bg-gray-800' : ''
        }`}
      >
        <p>{day.format('D')}</p>
      </div>
    )
  }

  return (
    <div class="bg-1">
      <div class="flex items-center justify-between pb-2">
        <button
          class="text-xl"
          onClick={() => changeMonth(-1)}
          ariaLabel="previous month"
        >
          <div class="flex items-center">
            <Icon name="arrow-back-outline" />
          </div>
        </button>
        <div class="flex items-center justify-between">
          <p class="font-bold">{start.format('MMM YYYY')}</p>
          <button
            class="text-xl"
            onClick={() => setStart(dayjs().startOf('month'))}
            ariaLabel="jump to today"
          >
            <div class="flex items-center">
              <Icon name="calendar-outline" />
            </div>
          </button>
        </div>
        <button
          class="text-xl"
          onClick={() => changeMonth(1)}
          ariaLabel="next month"
        >
          <div class="flex items-center">
            <Icon name="arrow-forward-outline" />
          </div>
        </button>
      </div>
      <div class="grid grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => dayjs().day(i)).map((day) => (
          <p key={day.format('dd')} class="text-center">
            {day.format('dd')}
          </p>
        ))}
        {weeks.map((week) => week.map((day) => printDay(day)))}
      </div>
    </div>
  )
}

export default Calendar
