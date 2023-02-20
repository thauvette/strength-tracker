import dayjs from 'dayjs'
import { h } from 'preact'
import { useState } from 'react'
import AnimateHeight from 'react-animate-height'

const VolumeRow = ({ day }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)
  return (
    <div class="border-b-4">
      <button
        disabled={!day.items?.length}
        class="p-0 w-full"
        onClick={toggleOpen}
      >
        <div class={`flex items-center justify-between py-4`}>
          <p>
            {dayjs(day.day).format("MMM DD 'YY")} -{' '}
            {day.workingSets || day.sets} sets - {day.workingReps} reps
          </p>
          <p>
            {day.diff && (
              <span class="text-sm">
                ({day.diff > 0 ? '+' : ''}
                {day.diff})
              </span>
            )}{' '}
            <span class="font-bold">{day.vol}</span>
          </p>
        </div>
      </button>

      <AnimateHeight height={isOpen ? 'auto' : 0}>
        <div class="pb-4">
          {day?.items?.length > 0
            ? day.items.map((set) => (
                <p key={set.created}>
                  {set.reps} @ {set.weight} {set.isWarmUp ? '(warm up)' : ''}
                </p>
              ))
            : null}
        </div>
      </AnimateHeight>
    </div>
  )
}

const Volume = ({ exerciseHistory }) => {
  const volumeByDay = exerciseHistory?.items
    ? Object.entries(exerciseHistory?.items).reduce((arr, [day, items]) => {
        const vol = items.reduce((num, set) => {
          return num + set.weight * set.reps
        }, 0)
        const workingSets = items?.filter((item) => !item?.isWarmUp)
        arr.push({
          day,
          vol,
          sets: items.length,
          items,
          workingSets: workingSets?.length || 0,
          workingReps: workingSets?.reduce((num, set) => {
            return num + +set.reps
          }, 0),
        })
        return arr
      }, [])
    : []

  return volumeByDay
    .sort((a, b) => (dayjs(a.day).isBefore(b.day) ? 1 : -1))
    .map((day, i) => {
      const diff = volumeByDay[i + 1]?.vol
        ? day.vol - volumeByDay[i + 1]?.vol
        : null

      return <VolumeRow key={day.day} day={{ ...day, diff }} />
    })
}

export default Volume
