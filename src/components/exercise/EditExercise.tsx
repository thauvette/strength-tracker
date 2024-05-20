import { h } from 'preact';
import ExerciseForm from '../exerciseForm/ExerciseForm';
import { Exercise } from '../../context/db/types';

interface Props {
  id: number;
  exercise: Exercise;
  onEdit: () => void;
}

const EditExercise = ({ id, exercise, onEdit }: Props) => (
  <div class="px-2">
    <ExerciseForm
      initialValues={{
        name: exercise?.name || '',
        primaryGroup: +exercise?.primaryGroup || null,
        musclesWorked: exercise?.musclesWorked || [],
        secondaryMusclesWorked: exercise?.secondaryMusclesWorked || [],
        exerciseType: exercise?.type || 'wr',
        notes: exercise?.notes || '',
        barWeight: exercise?.barWeight || 45,
      }}
      id={+id}
      onSubmit={onEdit}
    />
  </div>
);

export default EditExercise;
