import { h } from 'preact'
import dayjs from 'dayjs'
import { useState } from 'preact/hooks'
import ExerciseStats from '../exerciseStats/ExerciseStats'
import Plan from '../../routes/exercise/Plan'
import EditableSet from '../editableSet/editableSet'
import generateRandomId from '../../utilities.js/generateRandomId'
import Accordion from '../accordion/accordion'

const AddExerciseTabs = ({ selectedExercise, addedSets, setAddedSets }) => {
  const [view, setView] = useState('add')

  const views = {
    add: (
      <div>
        <EditableSet
          reps={addedSets?.[addedSets?.length - 1]?.reps || 0}
          weight={addedSets?.[addedSets?.length - 1]?.weight || 0}
          renderCtas={({ weight, reps }) => {
            return (
              <button
                class="bg-primary-900 text-white w-full"
                onClick={() =>
                  setAddedSets([
                    ...addedSets,
                    { weight, reps, id: generateRandomId() },
                  ])
                }
              >
                + Add Set
              </button>
            )
          }}
          disablePlateModal
        />
      </div>
    ),
    templates: (
      <div>
        {selectedExercise?.lastWorkoutHeaviestSet && (
          <p class="font-bold">
            Last heavy set: {selectedExercise?.lastWorkoutHeaviestSet?.reps}
            {' @ '}
            {selectedExercise?.lastWorkoutHeaviestSet?.weight}
            {' - '}
            {dayjs(selectedExercise?.lastWorkoutHeaviestSet?.created).format(
              'MMM DD YYYY',
            )}
          </p>
        )}
        <Plan
          initialWeight={selectedExercise?.lastWorkoutHeaviestSet?.weight}
          updatePlanedSet={(newSets) =>
            setAddedSets([
              ...addedSets,
              ...newSets.map((set) => ({
                ...set,
                id: generateRandomId(),
              })),
            ])
          }
          submitText="Add To Sets"
        />
      </div>
    ),
    history: (
      <div>
        <ExerciseStats exerciseHistory={selectedExercise} />
      </div>
    ),
  }

  const removeSet = (id) => {
    setAddedSets(addedSets.filter((set) => set.id !== id))
  }

  return (
    <>
      <div class="w-full overflow-y-hidden py-4 ">
        {addedSets?.length ? (
          <div class="pt-4 pb-2 border-b mb-4">
            {addedSets.map((set, i) => (
              <div key={set.id} class="border mb-2">
                <Accordion title={`Set ${i + 1} - ${set.reps} @ ${set.weight}`}>
                  <EditableSet
                    title={null}
                    weight={set.weight || 0}
                    reps={set.reps || 0}
                    handleRemove={() => removeSet(set.id)}
                    onChangeReps={(reps) => {
                      setAddedSets(
                        addedSets.map((addedSet, setIndex) =>
                          setIndex === i
                            ? {
                                ...addedSet,
                                reps,
                              }
                            : addedSet,
                        ),
                      )
                    }}
                    onChangeWeight={(weight) => {
                      setAddedSets(
                        addedSets.map((addedSet, setIndex) =>
                          setIndex === i
                            ? {
                                ...addedSet,
                                weight,
                              }
                            : addedSet,
                        ),
                      )
                    }}
                    onDuplicate={() =>
                      setAddedSets([
                        ...addedSets,
                        { ...set, id: generateRandomId() },
                      ])
                    }
                    disablePlateModal
                  />
                </Accordion>
              </div>
            ))}
          </div>
        ) : null}

        <div class="flex overscroll-x-auto">
          <button
            class={`px-2 py-1 text-xs bg-blue-100 text-gray-800 border-0 border-b-2 border-blue-900 rounded-none ${
              view === 'add' ? ' border-opacity-1' : 'border-opacity-0 '
            }`}
            onClick={() => setView('add')}
          >
            Custom
          </button>
          <button
            class={`px-2 py-1 text-xs bg-blue-100 text-gray-800 border-0 border-b-2 border-blue-900 rounded-none ${
              view === 'templates' ? ' border-opacity-1' : 'border-opacity-0 '
            }`}
            onClick={() => setView('templates')}
          >
            Templates
          </button>

          <button
            class={`px-2 py-1 text-xs bg-blue-100 text-gray-800 border-0 border-b-2 border-blue-900 rounded-none ${
              view === 'history' ? ' border-opacity-1' : 'border-opacity-0 '
            }`}
            onClick={() => setView('history')}
          >
            History
          </button>
        </div>
      </div>
      <div class="pb-4">{views[view]}</div>
    </>
  )
}

export default AddExerciseTabs
