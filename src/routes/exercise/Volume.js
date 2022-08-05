import dayjs from "dayjs"
import { h } from "preact"

const Volume = ({ exerciseHistory }) => {
  const volumeByDay = exerciseHistory?.items
    ? Object.entries(exerciseHistory?.items).reduce((arr, [day, items]) => {
        const vol = items.reduce((num, set) => {
          return num + set.weight * set.reps
        }, 0)
        arr.push({ day, vol, sets: items.length })
        return arr
      }, [])
    : []

  return volumeByDay.map(day => (
    <div
      key={day.day}
      class="flex items-center justify-between py-4 border-b-4"
    >
      <p>
        {dayjs(day.day).format("DD MMM YYYY")} - {day.sets} sets
      </p>
      <p>{day.vol}</p>
    </div>
  ))
}

export default Volume
