import { h } from 'preact'
import ExerciseForm from '../exerciseForm/ExerciseForm'

const EditExercise = ({ id, exerciseHistory, onEdit }) => (
  <div class="px-2">
    <ExerciseForm
      initialValues={{
        name: exerciseHistory?.name || '',
        primaryGroup: +exerciseHistory?.primaryGroup || '',
        musclesWorked:
          exerciseHistory?.musclesWorked?.map((group) => +group.id) || [],
        secondaryMusclesWorked:
          exerciseHistory?.secondaryMusclesWorked?.map((group) => +group.id) ||
          [],
        exerciseType: exerciseHistory?.type || 'wr',
        notes: exerciseHistory?.notes || '',
      }}
      id={+id}
      onSubmit={onEdit}
    />
  </div>
)

export default EditExercise
