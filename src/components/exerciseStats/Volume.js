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
            {dayjs(day.day).format('DD MMM YYYY')} {day.sets} sets
          </p>
          <p>{day.vol}</p>
        </div>
      </button>

      <AnimateHeight height={isOpen ? 'auto' : 0}>
        <div class="pb-4">
          {day?.items?.length > 0
            ? day.items.map((set) => (
                <p key={set.created}>
                  {set.reps} @ {set.weight}
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
        arr.push({ day, vol, sets: items.length, items })
        return arr
      }, [])
    : []

  return volumeByDay
    .sort((a, b) => (dayjs(a.day).isBefore(b.day) ? 1 : -1))
    .map((day) => <VolumeRow key={day.day} day={day} />)
}

export default Volume
