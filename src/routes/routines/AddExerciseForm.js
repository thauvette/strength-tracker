import { h } from 'preact'
import { useState } from 'preact/hooks'
import ExerciseSearch from '../../components/exerciseSelection/ExerciseSearch'
import useDB from '../../context/db/db'
import { formatHistory } from '../../hooks/useExerciseHistory/utils'
import AddExerciseTabs from './AddExerciseTabs'

const AddExerciseForm = ({ submit }) => {
  const [selectedExercise, setSelectedExercise] = useState(null)

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

  if (selectedExercise) {
    return (
      <div>
        <div class="border-b-1">
          <button onClick={() => setSelectedExercise(null)}>← Back</button>
          <p class="text-xl capitalize font-bold text-center">
            {selectedExercise?.name}
          </p>
        </div>
        <AddExerciseTabs selectedExercise={selectedExercise} submit={submit} />
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
