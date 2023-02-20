import { h } from 'preact'
import { useState } from 'preact/hooks'
import Counters from './counters/Counters'
import { weeks } from '../config/weights'

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
  fiveByFiveFlat: convertWeekMath([
    weeks[0][2],
    weeks[0][3],
    weeks[0][4],
    weeks[0][5],
    weeks[0][5],
    weeks[0][5],
    weeks[0][5],
    weeks[0][5],
  ]),
  threeByFiveFlat: convertWeekMath([
    weeks[0][2],
    weeks[0][3],
    weeks[0][4],
    weeks[0][5],
    weeks[0][5],
    weeks[0][5],
  ]),
}

const Plan = ({ initialWeight, updatePlanedSet, submitText = 'Save' }) => {
  const [goal, setGoal] = useState(initialWeight || 100)
  const [type, setType] = useState('threeByFiveAscending')
  const sets = maths[type].map((day, i) => ({
    reps: day.reps,
    weight: Math.round(day.math * goal),
    isWarmUp: i <= 2,
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
          <option value="fiveByFiveFlat">5 x 5 flat</option>
          <option value="threeByFiveFlat">3 x 5 flat</option>
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
        <p
          key={i}
          class={`mb-2 ${
            i > 2
              ? 'font-bold text-black dark:text-white'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          {set.reps} @ {set.weight} {i <= 2 ? '(warm up)' : '(working)'}
        </p>
      ))}
      <button
        class="bg-primary-900 text-white mt-4 w-full"
        onClick={() => {
          updatePlanedSet(sets)
        }}
      >
        {submitText}
      </button>
    </div>
  )
}

export default Plan
