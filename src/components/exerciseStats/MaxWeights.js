import { h } from 'preact'
import dayjs from 'dayjs'
import { useState } from 'preact/hooks'
import AnimateHeight from 'react-animate-height'
import { formatToFixed } from '../../utilities.js/formatNumbers'

const MaxWeights = ({ exerciseHistory, includeBwInHistory }) => {
  const prs = includeBwInHistory
    ? exerciseHistory?.prsWithBW
    : exerciseHistory?.prs
  return (
    <div class="px-2">
      {prs?.length ? (
        prs.map((set) => (
          <MaxWeightRow
            set={set}
            key={set.reps}
            includeBwInHistory={includeBwInHistory}
          />
        ))
      ) : (
        <p>No prs</p>
      )}
    </div>
  )
}

const MaxWeightRow = ({ set, includeBwInHistory }) => {
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
            ? daysHistory.map((daysSet) => {
                const weight = includeBwInHistory
                  ? formatToFixed(daysSet.weight + (daysSet.bw || 0))
                  : daysSet.weight
                return (
                  <p
                    key={daysSet.created}
                    class={
                      set.weight === weight
                        ? 'bg-blue-200 dark:bg-blue-900'
                        : ''
                    }
                  >
                    {daysSet.reps} @ {weight}
                  </p>
                )
              })
            : null}
        </div>
      </AnimateHeight>
    </div>
  )
}

export default MaxWeights
