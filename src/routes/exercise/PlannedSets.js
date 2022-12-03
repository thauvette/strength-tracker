import set from 'lodash.set'
import { h } from 'preact'
import { useState } from 'preact/hooks'
import Counters from '../../components/counters/Counters'
import EditableSet from '../../components/editableSet/editableSet'
import useSessionContext from '../../context/sessionData/sessionData'

const threeByFive = [0.47, 0.59, 0.71, 0.765, 0.88, 1]

const PlannedSets = ({ id, initialWeight }) => {
  const { updatePlanedSet, getPlannedSets } = useSessionContext()
  const [goal, setGoal] = useState(initialWeight || 100)
  const plannedSet = getPlannedSets(id)

  if (!plannedSet) {
    const sets = threeByFive.map((math) => ({
      reps: 5,
      weight: Math.round(math * goal),
    }))
    return (
      <div class="px-4">
        <div class="max-w-xs mx-auto py-6">
          <Counters
            value={goal}
            setValue={(val) => setGoal(val)}
            roundToFive
            jumpBy={5}
          />
        </div>
        {sets.map((set) => (
          <p key={set.weight}>
            {set.reps} @ {set.weight}
          </p>
        ))}
        <button
          class="bg-blue-900 text-white mt-4 w-full"
          onClick={() => {
            updatePlanedSet({
              id,
              sets,
            })
          }}
        >
          Save
        </button>
      </div>
    )
  }
  return (
    <div class="px-4">
      <h1 class="mb-6">Planned sets.</h1>
      {plannedSet.map(({ reps, weight }) => (
        <p key={weight}>
          {reps} @ {weight}
        </p>
      ))}
      <div class="pt-4">
        <button
          class="bg-red-900 text-white"
          onClick={() => updatePlanedSet({ id, sets: null })}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default PlannedSets
