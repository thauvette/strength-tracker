import { h } from 'preact'
import dayjs from 'dayjs'
import { useState } from 'preact/hooks'
import AnimateHeight from 'react-animate-height'

const MaxWeights = ({ exerciseHistory }) => (
  <div class="px-2">
    {exerciseHistory?.prs?.length ? (
      exerciseHistory?.prs.map((set) => (
        <MaxWeightRow set={set} key={set.reps} />
      ))
    ) : (
      <p>No prs</p>
    )}
  </div>
)

const MaxWeightRow = ({ set }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { daysHistory } = set
  return (
    <div class="border-b-4">
      <button
        disabled={!daysHistory?.length}
        class="p-0 w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          class={`flex items-center justify-between py-4  ${
            set.isActualSet ? 'font-bold' : 'opacity-90'
          }`}
        >
          <p>
            {set.reps} @ {set.displayWeight}
          </p>
          <p>{dayjs(set.date).format('DD MMM YYYY')}</p>
        </div>
      </button>
      <AnimateHeight height={isOpen ? 'auto' : 0}>
        <div class="pb-4">
          {daysHistory?.length > 0
            ? daysHistory.map((daysSet) => (
                <p
                  key={daysSet.created}
                  class={
                    set.displayWeight === daysSet.weight
                      ? 'bg-blue-200 dark:bg-blue-900'
                      : ''
                  }
                >
                  {daysSet.reps} @ {daysSet.weight}
                </p>
              ))
            : null}
        </div>
      </AnimateHeight>
    </div>
  )
}

export default MaxWeights
