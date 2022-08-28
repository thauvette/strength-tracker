import { h } from "preact"
import { useState } from "preact/hooks"

import dayjs from "dayjs"
import cloneDeep from "lodash.clonedeep"

import dateFormats from "../../config/dateFormats"

const BioMetric = ({ id, addEntry, bioMetrics }) => {
  const currentBioMetric = bioMetrics[id]
  const [value, setValue] = useState(
    currentBioMetric?.items?.[currentBioMetric?.items.length - 1]?.value || ""
  ) // get the last one

  const [date, setDate] = useState(dayjs().format(dateFormats.day))
  const [time, setTime] = useState(dayjs().format(dateFormats.time))

  const handleAddEntry = e => {
    e.preventDefault()
    addEntry({
      bioMetricId: id,
      data: {
        value,
        date: dayjs(`${date}T${time}:00`).format(),
      },
    })
  }

  const sortedItems = cloneDeep(currentBioMetric?.items || []).sort((a, b) =>
    dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1
  )

  return (
    <div class="px-2">
      <h1 class="capitalize">{currentBioMetric?.name}</h1>
      <form onSubmit={handleAddEntry} class="pb-4">
        <label class="flex items-center py-1">
          <p class="w-2/4 capitalize">{currentBioMetric?.name}</p>
          <input
            class="w-2/4"
            value={value}
            onInput={e => setValue(e.target.value)}
            placeholder={currentBioMetric?.name || ""}
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
      {sortedItems?.length > 0 && (
        <div class="py-4">
          <h2 class="mb-2">History</h2>
          {sortedItems.map((item, i) => {
            const diff = sortedItems[i + 1]?.value
              ? +item.value - sortedItems[i + 1]?.value
              : undefined

            return (
              <div key={item.id} class="border-blue-400 border-b-2 py-2">
                <p class="font-bold text-lg">
                  {dayjs(item.date).format(dateFormats.displayShort)}
                </p>

                <div>
                  <div class="grid-cols-2 grid py-2">
                    <p class="capitalize">{currentBioMetric?.name}</p>
                    <p>{item.value}</p>
                  </div>
                  <div class="grid-cols-2 grid py-2">
                    <p>Change</p>
                    <p>
                      {diff !== undefined
                        ? `${diff > 0 ? "+" : ""}${diff.toFixed(2)}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BioMetric
