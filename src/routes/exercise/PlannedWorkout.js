import { h } from 'preact'
import { useState } from 'preact/hooks'
import EditableSet from '../../components/editableSet/editableSet'
import ExerciseHistoryModal from '../../components/exerciseHistoryModal/ExerciseHistoryModal'
import Icon from '../../components/icon/Icon'

import useExerciseHistory from '../../hooks/useExerciseHistory/useExerciseHistory'

const PlannedWorkout = ({ sets, onUpdateSet, showHistoryInSets }) => {
  const firstIncompleteSet = sets
    .map(({ created }) => created)
    .indexOf(undefined)
  const [activeSet, setActiveSet] = useState(
    firstIncompleteSet >= 0 ? firstIncompleteSet : 0,
  )

  const [exerciseModalState, setExerciseModalState] = useState({
    id: null,
    isOpen: false,
  })

  const [exerciseHistory, getData] = useExerciseHistory(exerciseModalState.id)

  const saveSet = (set, index) => {
    setActiveSet(index + 1)
    onUpdateSet(set, index)
  }

  const openExerciseModal = (id) => {
    setExerciseModalState({
      id,
      isOpen: true,
    })
  }

  const closeExerciseModal = () =>
    setExerciseModalState({
      id: null,
      isOpen: false,
    })

  return (
    <div>
      {sets.map((set, i) => {
        const { reps, weight, created, exerciseName } = set
        return (
          <div key={i} class="border-b-4 pb-2 mb-4">
            <button class="w-full" onClick={() => setActiveSet(i)}>
              <div class="flex flex-wrap ">
                {created && <Icon name="checkmark-outline" width={32} />}
                <p class="capitalize  text-left">{exerciseName}</p>
                <p class="ml-auto">
                  {reps} @ {weight}
                </p>
              </div>
            </button>

            {i === activeSet && (
              <div class="pb-2">
                <EditableSet
                  reps={reps}
                  weight={weight}
                  renderCtas={({ reps, weight }) => {
                    return (
                      <div class="flex">
                        {showHistoryInSets && (
                          <button
                            onClick={() => openExerciseModal(set.exercise)}
                          >
                            <div class="flex flex-1 items-center gap-2">
                              <Icon name="list-outline" />
                              <p>History</p>
                            </div>
                          </button>
                        )}
                        <button
                          onClick={() => saveSet({ ...set, reps, weight }, i)}
                          class="flex-1 bg-blue-900 text-white"
                        >
                          {created ? 'Update' : 'Save'}
                        </button>
                      </div>
                    )
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
      {exerciseModalState.isOpen &&
        exerciseHistory?.id === exerciseModalState?.id && (
          <ExerciseHistoryModal
            isOpen={exerciseModalState.isOpen}
            onRequestClose={closeExerciseModal}
            onUpdate={getData}
            exerciseHistory={exerciseHistory}
          />
        )}
    </div>
  )
}

export default PlannedWorkout
