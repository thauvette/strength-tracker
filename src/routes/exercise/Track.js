import { h } from 'preact'

import useDB from '../../context/db/db'
import EditableSet from '../../components/editableSet/editableSet'
import SetRow from '../../components/setRow/setRow'
import useToast from '../../context/toasts/Toasts'

const Track = ({
  todaysHistory,
  exerciseId,
  onAddSet,
  lastWorkoutFirstSet,
  exerciseName,
}) => {
  const lastSet = todaysHistory?.[todaysHistory?.length - 1]
  const { createOrUpdateLoggedSet } = useDB()
  const { fireToast } = useToast()
  const submitNewSet = async ({ weight, reps }) => {
    fireToast({ text: `${exerciseName?.toUpperCase() || ''} SET ADDED` })
    await createOrUpdateLoggedSet(null, { weight, reps, exercise: +exerciseId })
    onAddSet()
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
                class={`bg-blue-900 text-white w-full transition-all duration-200`}
                onClick={() => {
                  submitNewSet({ weight, reps })
                }}
              >
                Save
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
