import { h } from 'preact'
import { useState } from 'preact/hooks'

import useDB from '../../context/db/db'
import EditableSet from '../../components/editableSet/editableSet'
import SetRow from '../../components/setRow/setRow'

const Track = ({
  todaysHistory,
  exerciseId,
  onAddSet,
  lastWorkoutFirstSet,
}) => {
  const lastSet = todaysHistory?.[todaysHistory?.length - 1]
  const [adding, setAdding] = useState(false)
  const { createOrUpdateLoggedSet } = useDB()

  const submitNewSet = async ({ weight, reps }) => {
    setAdding(true)
    await createOrUpdateLoggedSet(null, { weight, reps, exercise: +exerciseId })
    onAddSet()

    setTimeout(() => {
      setAdding(false)
      window.scrollTo({
        left: 0,
        top: window.innerHeight,
        behavior: 'smooth',
      })
    }, 250)
  }

  return (
    <div class="relative">
      <div className="border-b-4 pb-4">
        <p>New Set</p>
        <EditableSet
          reps={lastSet?.reps || lastWorkoutFirstSet?.reps || 0}
          weight={lastSet?.weight || lastWorkoutFirstSet?.weight || 0}
          renderCtas={({ weight, reps }) => (
            <div class="px-2">
              <button
                disabled={adding}
                class={`${
                  adding ? 'bg-gray-900 ' : 'bg-blue-900 '
                } text-white w-full transition-all duration-200`}
                onClick={() => {
                  submitNewSet({ weight, reps })
                }}
              >
                {adding ? 'Set Added' : 'Save'}
              </button>
            </div>
          )}
        />
      </div>
      <p>Today</p>
      {!!todaysHistory?.length &&
        todaysHistory.map((item) => (
          <div key={item.id} class="px-1">
            <SetRow set={item} onChangeSet={onAddSet} isIntersecting={true} />
          </div>
        ))}
    </div>
  )
}

export default Track
