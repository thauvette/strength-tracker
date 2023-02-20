import { h } from 'preact'

import useDB from '../../context/db/db'
import useToast from '../../context/toasts/Toasts'

import EditableSet from '../editableSet/editableSet'
import SetRow from '../setRow/setRow'

const Track = ({
  todaysHistory,
  exerciseId,
  onAddSet,
  lastWorkoutFirstSet,
  exerciseName,
  savedSet,
  setSavedSet,
}) => {
  const lastSet = todaysHistory?.[todaysHistory?.length - 1]
  const { createOrUpdateLoggedSet } = useDB()
  const { fireToast } = useToast()

  const submitNewSet = async ({ weight, reps, isWarmUp }) => {
    fireToast({ text: `${exerciseName?.toUpperCase() || ''} SET ADDED` })
    await createOrUpdateLoggedSet(null, {
      weight,
      reps,
      isWarmUp,
      exercise: +exerciseId,
    })
    onAddSet()
  }
  return (
    <div class="relative px-2">
      <div className="border-b-4 border-gray-200 dark:border-gray-600 pb-4">
        <p class="text-xl">New Set</p>
        <EditableSet
          reps={
            savedSet?.reps || lastSet?.reps || lastWorkoutFirstSet?.reps || 0
          }
          weight={
            savedSet?.weight ||
            lastSet?.weight ||
            lastWorkoutFirstSet?.weight ||
            0
          }
          isWarmUp={
            savedSet?.isWarmUp ||
            lastSet?.isWarmUp ||
            lastWorkoutFirstSet?.isWarmUp
          }
          renderCtas={({ weight, reps, isWarmUp }) => (
            <div class="px-2">
              <button
                class={`primary w-full`}
                onClick={() => {
                  submitNewSet({ weight, reps, isWarmUp })
                }}
              >
                Save
              </button>
            </div>
          )}
          onChangeReps={(reps) =>
            setSavedSet({
              ...savedSet,
              reps,
            })
          }
          onChangeWeight={(weight) =>
            setSavedSet({
              ...savedSet,
              weight,
            })
          }
        />
      </div>
      <div class="mx-2 pt-4">
        <p class="text-xl">Today</p>
      </div>

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
