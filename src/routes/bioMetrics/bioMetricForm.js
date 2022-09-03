import { h } from "preact"
import { useState } from "preact/hooks"
import dayjs from "dayjs"
import dateFormats from "../../config/dateFormats"

const BioMetricForm = ({ initialValues, submit, name }) => {
  const [date, setDate] = useState(
    initialValues?.date || dayjs().format(dateFormats.day)
  )
  const [time, setTime] = useState(
    initialValues?.time || dayjs().format(dateFormats.time)
  )
  const [value, setValue] = useState(initialValues?.value || "")

  const handleAddEntry = e => {
    e.preventDefault()
    submit({
      value,
      date: dayjs(`${date}T${time}:00`).format(),
    })
  }

  return (
    <form onSubmit={handleAddEntry} class="pb-4">
      <label class="flex items-center py-1">
        <p class="w-2/4 capitalize">{name}</p>
        <input
          class="w-2/4"
          value={value}
          onInput={e => setValue(e.target.value)}
          placeholder={name || ""}
        />
      </label>
      <label class="flex items-center py-1">
        <p class="w-2/4">Date</p>
        <input
          class="w-2/4"
          type="date"
          value={date}
          onInput={e => {
            setDate(e.target.value)
          }}
          placeholder="date"
        />
      </label>
      <label class="flex items-center py-1">
        <p class="w-2/4">Time</p>
        <input
          class="w-2/4"
          type="time"
          onInput={e => {
            setTime(e.target.value)
          }}
          value={time}
          placeholder="time"
        />
      </label>

      <button class="btn primary w-full" type="submit">
        Add +
      </button>
    </form>
  )
}

export default BioMetricForm
