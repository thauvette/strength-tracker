import dayjs from "dayjs"
import { h } from "preact"
import chunk from "lodash.chunk"
import { useState, useRef } from "preact/hooks"

const Calendar = ({ startDate, renderDay }) => {
  const [start, setStart] = useState(
    dayjs(startDate || new Date()).startOf("month")
  )

  const end = dayjs(start).endOf("month")
  const padding = Array.from({ length: +start.format("d") })
  const days = Array.from({ length: +end.format("DD") }, (_, i) =>
    start.add(i, "days")
  )
  const weeks = chunk([...padding, ...days], 7)

  const changeMonth = amount => {
    setStart(start.add(amount, "month").startOf("month"))
  }

  const printDay = day => {
    if (!day) return <div />
    return renderDay ? (
      renderDay(day)
    ) : (
      <div class="text-center py-2">
        <p>{day.format("D")}</p>
      </div>
    )
  }

  return (
    <div class="">
      <div class="flex items-center justify-between pb-2">
        <button onClick={() => changeMonth(-1)}>{"← Prev"}</button>
        <div class="flex items-center justify-between">
          <p class="font-bold">{start.format("MMMM YYYY")}</p>
          <button onClick={() => setStart(dayjs().startOf("month"))}>
            {"🗓"}
          </button>
        </div>
        <button onClick={() => changeMonth(1)}>{"Next →"}</button>
      </div>
      <div class="grid grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => dayjs().day(i)).map(day => (
          <p key={day.format("dd")} class="text-center">
            {day.format("dd")}
          </p>
        ))}
        {weeks.map(week => week.map((day, dayIndex) => printDay(day)))}
      </div>
    </div>
  )
}

export default Calendar
