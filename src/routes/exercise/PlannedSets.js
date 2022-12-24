import { h } from 'preact'

import Plan from './Plan'
import PlannedWorkout from './PlannedWorkout'
import useDB from '../../context/db/db'

const PlannedSets = ({
  id,
  initialWeight,
  onChangeCompleteSet,
  updatePlanedSet,
  plannedSet,
}) => {
  const { createOrUpdateLoggedSet } = useDB()
  if (!plannedSet) {
    return (
      <Plan
        initialWeight={initialWeight}
        updatePlanedSet={(sets) =>
          updatePlanedSet({
            id,
            sets,
          })
        }
      />
    )
  }
  return (
    <div class="px-4">
      <h1 class="mb-6">Planned sets</h1>
      <PlannedWorkout
        sets={plannedSet || []}
        onUpdateSet={({ reps, weight }, index) => {
          const currentSet = { ...plannedSet[index], reps, weight }
          // create or update (if setID exists) set in DB
          createOrUpdateLoggedSet(currentSet.id, {
            ...currentSet,
            exercise: +id,
          }).then((res) => {
            updatePlanedSet({
              id,
              sets: plannedSet.map((set, i) => {
                return i === index ? res : set
              }),
            })
            onChangeCompleteSet()
          })
        }}
      />

      <div class="pt-4">
        <button
          class="bg-red-900 text-white"
          onClick={() => updatePlanedSet({ id, sets: null })}
        >
          Remove Planned Set
        </button>
        <p>This will not delete any logged sets</p>
      </div>
    </div>
  )
}

export default PlannedSets
