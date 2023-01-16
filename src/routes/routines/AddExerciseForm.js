import { h } from 'preact'
import { useState } from 'preact/hooks'
import ExerciseSearch from '../../components/exerciseSelection/ExerciseSearch'
import Icon from '../../components/icon/Icon'
import useDB from '../../context/db/db'
import { formatHistory } from '../../hooks/useExerciseHistory/utils'
import AddExerciseTabs from './AddExerciseTabs'

const AddExerciseForm = ({ submit }) => {
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [addedSets, setAddedSets] = useState([])

  const { getExerciseHistoryById } = useDB()

  const selectExercise = async (exercise) => {
    const data = await getExerciseHistoryById(+exercise.id)

    if (data) {
      setSelectedExercise({
        id: +exercise.id,
        ...data,
        ...formatHistory(data?.items || []),
      })
    }
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
  if (selectedExercise) {
    return (
      <div>
        <div class="border-b-1 flex items center">
          <button
            onClick={() => {
              setSelectedExercise(null)
              setAddedSets([])
            }}
          >
            ← Back
          </button>
          <p class="text-xl capitalize font-bold text-center flex-1">
            {selectedExercise?.name}
          </p>
          <div>
            {addedSets?.length ? (
              <button onClick={handleSubmit}>
                <div class="flex items-center">
                  <Icon name="save-outline" />
                  <p class="ml-1">Save</p>
                </div>
              </button>
            ) : null}
          </div>
        </div>
        <AddExerciseTabs
          selectedExercise={selectedExercise}
          submit={submit}
          addedSets={addedSets}
          setAddedSets={setAddedSets}
        />
      </div>
    )
  }

  return (
    <div>
      <ExerciseSearch
        handleSelectExercise={(exercise) => selectExercise(exercise)}
      />
    </div>
  )
}

export default AddExerciseForm
