import { h } from 'preact'
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

  const { createOrUpdateLoggedSet } = useDB()

  const submitNewSet = async ({ weight, reps }) => {
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
                class="bg-blue-900 text-white w-full"
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
