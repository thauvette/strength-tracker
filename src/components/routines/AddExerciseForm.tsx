import { h } from 'preact';
import { useState } from 'preact/hooks';
import ExerciseSearch from '../exerciseSelection/ExerciseSearch';
import useDB from '../../context/db/db';
import { Exercise, Set } from '../../context/db/types';
import { formatHistory } from '../../hooks/useExerciseHistory/utils.js';
import AddExerciseTabs from './AddExerciseTabs';
import LoadingSpinner from '../LoadingSpinner.js';

export interface SubmittedSet extends Set {
  dayId: string;
  routineId: string;
  routineSetId: string;
  id?: number;
  exerciseName: string;
}

interface Props {
  submit: (sets: SubmittedSet[]) => void;
  addFromHistory: (sets: SubmittedSet[]) => void;
}

// TODO: do we need both of these submits?
const AddExerciseForm = ({ submit, addFromHistory }: Props) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [addedSets, setAddedSets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getExerciseHistoryById } = useDB();

  const selectExercise = async (exercise: Exercise) => {
    setIsLoading(true);
    const data = await getExerciseHistoryById(+exercise.id);

    if (data) {
      setSelectedExercise({
        id: +exercise.id,
        ...data,
        ...formatHistory({
          items: data?.items || [],
          includeBwInHistory: data.type === 'bwr',
        }),
      });
    }
    setIsLoading(false);
  };
  const handleSubmit = () => {
    submit(
      addedSets.map((set) => ({
        ...set,
        exercise: selectedExercise.id,
        exerciseName: selectedExercise.name,
      })),
    );
  };
  if (selectedExercise) {
    return (
      <div>
        <div class="border-b-1">
          <button
            onClick={() => {
              setSelectedExercise(null);
              setAddedSets([]);
            }}
          >
            ← Back
          </button>
          <p class="text-xl capitalize font-bold text-center flex-1">
            {selectedExercise?.name}
          </p>
        </div>
        <AddExerciseTabs
          selectedExercise={selectedExercise}
          submit={handleSubmit}
          addedSets={addedSets}
          setAddedSets={setAddedSets}
          addFromHistory={addFromHistory}
        />
      </div>
    );
  }

  return (
    <div class="relative">
      <ExerciseSearch
        handleSelectExercise={(exercise: Exercise) => {
          console.log(exercise);
          setSelectedExercise(exercise);
        }}
      />
      {isLoading && (
        <div class="absolute inset-0 flex pt-40 justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default AddExerciseForm;
