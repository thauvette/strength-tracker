import dayjs from "dayjs"
import { h } from "preact"
import chunk from "lodash.chunk"
import { useState } from "preact/hooks"

import calIcon from "../../assets/icons/calendar-outline.svg"
import forwardIcon from "../../assets/icons/arrow-forward-outline.svg"
import backIcon from "../../assets/icons/arrow-back-outline.svg"

const Calendar = ({ startDate, renderDay }) => {
  const [start, setStart] = useState(
    dayjs(startDate || new Date()).startOf("month")
  )

  const end = dayjs(start).endOf("month")

  const prevMonth = dayjs(start).subtract(1, "month")

  const endOfPrevMonth = prevMonth.endOf("month").format("D")

  const firstNeededDateOfPrevMonth = +endOfPrevMonth - +start.format("d") + 1

  const firstDay = prevMonth.date(firstNeededDateOfPrevMonth)

  const paddingStart = Array.from({ length: +start.format("d") }, (_, i) =>
    firstDay.add(i, "days")
  )

  const days = Array.from({ length: +end.format("DD") }, (_, i) =>
    start.add(i, "days")
  )

  const paddingEnd = Array.from(
    { length: 6 - start.endOf("month").day() },
    (_, i) => start.endOf("month").add(i + 1, "days")
  )

  const weeks = chunk([...paddingStart, ...days, ...paddingEnd], 7)

  const changeMonth = amount => {
    setStart(start.add(amount, "month").startOf("month"))
  }

  const printDay = day => {
    if (!day) return <div />
    const isCurrentMonth = day.isSame(start, "month")
    return renderDay ? (
      renderDay(day, isCurrentMonth)
    ) : (
      <div class={`text-center py-2 ${!isCurrentMonth ? "bg-gray-100" : ""}`}>
        <p>{day.format("D")}</p>
      </div>
    )
  }

  return (
    <div class="">
      <div class="flex items-center justify-between pb-2">
        <button onClick={() => changeMonth(-1)}>
          <img src={backIcon} alt="previous month" class="w-6 h-6" />
        </button>
        <div class="flex items-center justify-between">
          <p class="font-bold">{start.format("MMM YYYY")}</p>
          <button onClick={() => setStart(dayjs().startOf("month"))}>
            <img class="w-6 h-6" src={calIcon} alt="today" />
          </button>
        </div>
        <button onClick={() => changeMonth(1)}>
          <img src={forwardIcon} alt="next month" class="w-6 h-6" />
        </button>
      </div>
      <div class="grid grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => dayjs().day(i)).map(day => (
          <p key={day.format("dd")} class="text-center">
            {day.format("dd")}
          </p>
        ))}
        {weeks.map(week => week.map(day => printDay(day)))}
      </div>
    </div>
  )
}

export default Calendar
