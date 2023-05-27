import { h } from 'preact'
import { Link } from 'preact-router'
import { useState } from 'preact/hooks'
import EditableSet from './editableSet/editableSet'
import ExerciseHistoryModal from './exerciseHistoryModal/ExerciseHistoryModal'
import Icon from './icon/Icon'
import { routes } from '../config/routes'
import useExerciseHistory from '../hooks/useExerciseHistory/useExerciseHistory'

const PlannedWorkout = ({
  sets,
  onUpdateSet,
  showHistoryInSets,
  showLinkToExercise,
}) => {
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
        const {
          reps,
          weight,
          created,
          exerciseName,
          exercise,
          isWarmUp,
          barWeight,
        } = set
        return (
          <div key={i} class="border-b-4 pb-2 mb-4">
            <button
              class="w-full"
              onClick={() => setActiveSet(i === activeSet ? null : i)}
            >
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
                  isWarmUp={isWarmUp}
                  barWeight={barWeight}
                  renderCtas={({ reps, weight, isWarmUp }) => {
                    return (
                      <div>
                        <button
                          onClick={() =>
                            saveSet({ ...set, reps, weight, isWarmUp }, i)
                          }
                          class="primary w-full"
                        >
                          {created ? 'Update' : 'Save'}
                        </button>
                        <div class="flex items-center justify-between gap-2 pt-4 ">
                          {showHistoryInSets && (
                            <button
                              class="secondary flex-1"
                              onClick={() => openExerciseModal(set.exercise)}
                            >
                              <div class="flex items-center justify-center gap-2">
                                <Icon name="list-outline" />
                                <p>History</p>
                              </div>
                            </button>
                          )}
                          {showLinkToExercise && (
                            <Link href={`${routes.exerciseBase}/${exercise}`}>
                              Go to {exerciseName}
                            </Link>
                          )}
                        </div>
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
