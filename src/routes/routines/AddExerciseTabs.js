import { h } from 'preact'
import dayjs from 'dayjs'
import { useState } from 'preact/hooks'
import ExerciseStats from '../../components/exerciseStats/ExerciseStats'
import Plan from '../exercise/Plan'
import EditableSet from '../../components/editableSet/editableSet'
import generateRandomId from '../../utilities.js/generateRandomId'

const AddExerciseTabs = ({ selectedExercise, submit }) => {
  const [view, setView] = useState('templates')
  const [addedSets, setAddedSets] = useState([])
  const views = {
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

  const handleSubmit = () => {
    if (!addedSets?.length) {
      submit([
        {
          exerciseId: selectedExercise.id,
          exerciseName: selectedExercise.name,
          freeForm: true,
        },
      ])
      return
    }

    submit(
      addedSets.map((set) => ({
        ...set,
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
      })),
    )
  }

  return (
    <div>
      <div class="w-full overflow-y-hidden py-4">
        <div class="pt-4 pb-8">
          <p class="mb-4">Added Sets</p>
          {addedSets?.length
            ? addedSets.map((set, i) => (
                <EditableSet
                  key={set.id}
                  title={`Set ${i + 1}`}
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
                />
              ))
            : null}
          <div>
            <button
              onClick={() =>
                setAddedSets([
                  ...addedSets,
                  { weight: '', reps: '', id: generateRandomId() },
                ])
              }
            >
              Add Set
            </button>
          </div>
          <div class="pt-4 flex">
            <button
              class="bg-gray-200 flex-1 mr-2"
              onClick={() => setAddedSets([])}
            >
              Reset
            </button>
            <button
              class="bg-blue-900 text-white flex-1 ml-2"
              onClick={handleSubmit}
            >
              {addedSets?.length ? 'Save' : 'Save without sets'}
            </button>
          </div>
        </div>
        <div class="flex overscroll-x-auto">
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
      {views[view]}
    </div>
  )
}

export default AddExerciseTabs
