import { h } from 'preact'
import { useState } from 'preact/hooks'
import Counters from '../../components/counters/Counters'
import useSessionContext from '../../context/sessionData/sessionData'

import { weeks } from '../../config/weights'

const convertWeekMath = (week) => {
  const maxPercent = Math.max(...week.map(({ math }) => math))
  return week.map((day) => ({
    ...day,
    math: day.math / maxPercent,
  }))
}

const maths = {
  threeByFiveAscending: convertWeekMath(weeks[0]),
  threeByFivePyramid: convertWeekMath([
    ...weeks[0],
    weeks[0][weeks[0].length - 2],
    weeks[0][weeks[0].length - 3],
  ]),
  fiveThreeOne: convertWeekMath(weeks[2]),
}

const PlannedSets = ({ id, initialWeight }) => {
  const { updatePlanedSet, getPlannedSets } = useSessionContext()
  const [goal, setGoal] = useState(initialWeight || 100)
  const [type, setType] = useState('threeByFiveAscending')

  const plannedSet = getPlannedSets(id)

  if (!plannedSet) {
    const sets = maths[type].map((day) => ({
      reps: day.reps,
      weight: Math.round(day.math * goal),
    }))
    return (
      <div class="px-4">
        <div class="max-w-xs">
          <p>Workout type (includes warm up)</p>
          <select
            class="w-full "
            value={type}
            onInput={(e) => {
              setType(e.target.value)
            }}
          >
            <option value="threeByFiveAscending">3 x 5 Ascending</option>
            <option value="threeByFivePyramid">5 x 5 Pyramid</option>
            <option value="fiveThreeOne">5 3 1</option>
          </select>
        </div>
        <div class="max-w-xs py-6">
          <p>Goal</p>
          <Counters
            value={goal}
            setValue={(val) => setGoal(val)}
            roundToFive
            jumpBy={5}
          />
        </div>
        {sets.map((set, i) => (
          <p key={i} class={`mb-2 ${i > 2 ? 'bg-blue-200' : ''}`}>
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
      {plannedSet.map(({ reps, weight }, i) => (
        <p key={i}>
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
