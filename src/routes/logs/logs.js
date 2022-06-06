import { h } from "preact"
import dayjs from "dayjs"
import { useEffect, useState } from "preact/hooks"
import useDB from "../../context/db"
import Modal from "../../components/modal/Modal"
import Calendar from "../../components/calendar/Calendar"

const Logs = () => {
  const { getAllSetsHistory } = useDB()
  const [logState, setLogState] = useState({
    loading: true,
    data: null,
    error: null,
  })

  const [activeDate, setActiveDate] = useState(dayjs().format("YYYY-MM-DD"))
  const [calendarIsOpen, setCalendarIsOpen] = useState(false)
  useEffect(() => {
    getAllSetsHistory().then(res => {
      setLogState({
        loading: false,
        error: null,
        data: res,
      })
    })
  }, [])

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
  const activeDayData = logState.data?.[activeDate]

  const stepByDate = amount =>
    setActiveDate(dayjs(activeDate).add(amount, "days").format("YYYY-MM-DD"))

  const toggleCalendar = () => setCalendarIsOpen(!calendarIsOpen)

  const selectDate = date => {
    setActiveDate(date.format("YYYY-MM-DD"))
    setCalendarIsOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button onClick={() => stepByDate(-1)}>{"←"}</button>
        <button class="m-0" onClick={toggleCalendar}>
          {dayjs(activeDate).format("MMM DD, YYYY ")}
        </button>
        <button onClick={() => stepByDate(1)}>{"→"}</button>
      </div>
      {activeDayData?.length > 0 &&
        activeDayData.map(item => {
          return (
            <p key={item.created}>
              {item.name}: {item.reps}@{item.weight}
            </p>
          )
        })}

      <Modal isOpen={calendarIsOpen} onRequestClose={toggleCalendar}>
        <Calendar
          startDate={activeDate}
          renderDay={day => {
            const isToday = day.isSame(dayjs(), "day")
            const dayData = logState.data?.[day.format("YYYY-MM-DD")]
            const hasData = !!dayData?.length
            const groupString = hasData
              ? Array.from(
                  new Set(
                    dayData.map(exercise =>
                      exercise.primaryGroup.substring(0, 1)
                    )
                  )
                )
              : null

            return (
              <div
                class={`text-center ${hasData || isToday ? "bg-blue-100" : ""}`}
              >
                <button onClick={() => selectDate(day)}>
                  {day.format("D")}
                  {groupString && (
                    <p class="text-xs m-0">{groupString.join(",")}</p>
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
