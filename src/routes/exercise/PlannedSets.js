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
      <div>
        <Counters
          value={goal}
          setValue={(val) => setGoal(val)}
          roundToFive
          jumpBy={5}
        />
        {sets.map((set) => (
          <p key={set.weight}>
            {set.reps} @ {set.weight}
          </p>
        ))}
        <button
          class="bg-blue-900 text-white"
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
    <div>
      <h1>Planned sets.</h1>
      {plannedSet.map(({ reps, weight }) => (
        <p key={weight}>
          {reps} @ {weight}
        </p>
      ))}
      <div>
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
