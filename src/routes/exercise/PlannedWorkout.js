import { h } from 'preact'
import { useState } from 'preact/hooks'
import EditableSet from '../../components/editableSet/editableSet'
import Icon from '../../components/icon/Icon'

const PlannedWorkout = ({ sets, onUpdateSet }) => {
  const firstIncompleteSet = sets
    .map(({ created }) => created)
    .indexOf(undefined)
  const [activeSet, setActiveSet] = useState(
    firstIncompleteSet >= 0 ? firstIncompleteSet : 0,
  )

  const saveSet = (set, index) => {
    setActiveSet(index + 1)
    onUpdateSet(set, index)
  }

  return (
    <div>
      {sets.map((set, i) => {
        const { reps, weight, created, exerciseName } = set
        return (
          <div key={i} class="border-b-4 pb-2 mb-4">
            <button onClick={() => setActiveSet(i)}>
              <div class="flex">
                {created && <Icon name="checkmark-outline" width={32} />}
                <p class="capitalize">
                  {exerciseName} - {reps} @ {weight}
                </p>
              </div>
            </button>
            {i === activeSet && (
              <EditableSet
                reps={reps}
                weight={weight}
                renderCtas={({ reps, weight }) => {
                  return (
                    <button
                      onClick={() => saveSet({ ...set, reps, weight }, i)}
                      class="w-full bg-blue-900 text-white"
                    >
                      {created ? 'Update' : 'Save'}
                    </button>
                  )
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PlannedWorkout
