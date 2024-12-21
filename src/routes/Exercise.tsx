import { h } from 'preact';
import { useState } from 'preact/hooks';

import useDB from '../context/db/db';
import { objectStores } from '../context/db/config';
import Icon from '../components/icon/Icon.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ExerciseLinks from '../components/exercise/ExerciseLinks';
import { Exercise as IExercise } from '../context/db/types';
import useOnMount from '../hooks/useOnMount';
import ExerciseRoutes from '../components/exercise/ExerciseRoutes';

const Exercise = ({ id, remaining_path }) => {
  const { updateEntry, getExercise } = useDB();

  const [exerciseState, setExerciseState] = useState<{
    loading: boolean;
    data: IExercise | null;
    error: null | string;
  }>({
    loading: true,
    data: null,
    error: null,
  });

  const getExerciseDetails = async () => {
    let error = null;
    let data = null;

    try {
      data = await getExercise(+id);
    } catch (err) {
      error = 'error getting exercise data';
      if (err instanceof Error) {
        error = err.message;
      }
    }
    setExerciseState({
      loading: false,
      error,
      data,
    });
  };

  useOnMount(getExerciseDetails);

  const { data: exercise, error, loading } = exerciseState;
  if (error) {
    return (
      <div class="flex justify-center">
        <p>{exerciseState.error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div class="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const toggleExerciseFavorite = () => {
    updateEntry(objectStores.exercises, id, {
      isFavorite: !exercise?.isFavorite,
    }).finally(() => {
      void getExerciseDetails();
    });
  };

  return (
    <div>
      <div class="p-3">
        <div class="flex items-center justify-between">
          <h1 class="capitalize">{exercise?.name}</h1>

          <button
            onClick={toggleExerciseFavorite}
            class="text-highlight-900 dark:text-highlight-100"
          >
            <Icon
              width="28"
              name={exercise?.isFavorite ? 'star' : 'star-outline'}
            />
          </button>
        </div>
        {exercise?.notes && <p>{exercise?.notes}</p>}
      </div>

      <ExerciseLinks path={remaining_path} id={id} />

      <ExerciseRoutes
        id={+id}
        exercise={exercise}
        getExerciseDetails={getExerciseDetails}
      />
    </div>
  );
};

export default Exercise;
