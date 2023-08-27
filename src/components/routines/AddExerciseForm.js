import { h } from 'preact';
import { useState } from 'preact/hooks';
import ExerciseSearch from '../exerciseSelection/ExerciseSearch';
import Icon from '../icon/Icon';
import useDB from '../../context/db/db.tsx';
import { formatHistory } from '../../hooks/useExerciseHistory/utils';
import AddExerciseTabs from './AddExerciseTabs';
import Modal from '../modal/Modal';
import LoadingSpinner from '../LoadingSpinner';

const AddExerciseForm = ({ submit }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [addedSets, setAddedSets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getExerciseHistoryById } = useDB();

  const selectExercise = async (exercise) => {
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
    if (!addedSets?.length) {
      submit([
        {
          exerciseId: selectedExercise.id,
          exerciseName: selectedExercise.name,
          freeForm: true,
        },
      ]);
      return;
    }

    submit(
      addedSets.map((set) => ({
        ...set,
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
      })),
    );
  };
  if (selectedExercise) {
    return (
      <div>
        <div class="border-b-1 flex items center">
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
    );
  }

  return (
    <div class="relative">
      <ExerciseSearch
        handleSelectExercise={(exercise) => selectExercise(exercise)}
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
