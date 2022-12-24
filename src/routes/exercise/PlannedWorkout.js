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

  const saveSet = ({ reps, weight }, index) => {
    setActiveSet(index + 1)
    onUpdateSet({ reps, weight }, index)
  }

  return (
    <div>
      {sets.map(({ reps, weight, created }, i) => {
        return (
          <div key={i}>
            <button onClick={() => setActiveSet(i)}>
              <div class="flex">
                {created && <Icon name="checkmark-outline" width={32} />}
                <p>
                  {reps} @ {weight}
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
                      onClick={() => saveSet({ reps, weight }, i)}
                      class="w-full bg-blue-900 text-white"
                    >
                      Save
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
