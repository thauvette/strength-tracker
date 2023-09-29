import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Router, route } from 'preact-router';

import useDB from '../context/db/db.tsx';
import { objectStores } from '../context/db/config.ts';
import useSessionContext from '../context/sessionData/sessionData';
import useExerciseHistory from '../hooks/useExerciseHistory/useExerciseHistory';

import { routes } from '../config/routes';

import ExerciseStats from '../components/exerciseStats/ExerciseStats';
import Track from '../components/exercise/Track';
import EditExercise from '../components/exercise/EditExercise';
import PlannedSets from '../components/PlannedSets';
import Icon from '../components/icon/Icon';
import LoadingSpinner from '../components/LoadingSpinner';
import ExerciseLinks from '../components/exercise/ExerciseLinks';

const Exercise = ({ id, remaining_path }) => {
  const { exerciseHistory, getData, savedSet, setSavedSet, isLoading } =
    useExerciseHistory(id);
  const { updateEntry } = useDB();
  const { updatePlanedSet, plannedSets } = useSessionContext();
  const plannedSet = plannedSets?.[id];

  useEffect(() => {
    if (plannedSet) {
      route(`/exercise/${id}/planned`);
    }
  }, []); // eslint-disable-line

  if (!exerciseHistory || isLoading) {
    return (
      <div class="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const toggleExerciseFavorite = () => {
    updateEntry(objectStores.exercises, id, {
      isFavorite: !exerciseHistory?.isFavorite,
    }).finally(() => {
      getData();
    });
  };
  return (
    <div>
      <div class="px-3 py-3 ">
        <div class="flex items-center justify-between">
          <h1 class="capitalize">{exerciseHistory?.name}</h1>

          <button
            onClick={toggleExerciseFavorite}
            class="text-highlight-900 dark:text-highlight-100"
          >
            <Icon
              width="28"
              name={exerciseHistory?.isFavorite ? 'star' : 'star-outline'}
            />
          </button>
        </div>
        {exerciseHistory?.notes && <p>{exerciseHistory.notes}</p>}
      </div>

      <ExerciseLinks path={remaining_path} id={id} />

      <Router>
        <Track
          path={`${routes.exerciseBase}/:id`}
          todaysHistory={exerciseHistory?.todaysHistory}
          exerciseId={id}
          onAddSet={getData}
          exerciseName={exerciseHistory?.name}
          savedSet={savedSet}
          setSavedSet={setSavedSet}
          barWeight={exerciseHistory?.barWeight || 45}
        />
        <ExerciseStats
          path={`${routes.exerciseBase}/:id/history`}
          exerciseHistory={exerciseHistory}
          onChangeSet={getData}
        />
        <EditExercise
          path={`${routes.exerciseBase}/:id/edit`}
          exerciseHistory={exerciseHistory}
          onEdit={getData}
        />
        <PlannedSets
          path={`${routes.exerciseBase}/:id/planned`}
          lastHeavySet={exerciseHistory?.lastWorkout?.heaviestSet}
          onChangeCompleteSet={(set) => {
            setSavedSet(set);
            getData();
          }}
          plannedSet={plannedSet}
          updatePlanedSet={({ id, sets }) => {
            updatePlanedSet({
              id,
              sets: sets?.map((set) => ({
                ...set,
                exerciseName: exerciseHistory?.name,
                barWeight: exerciseHistory.barWeight,
              })),
            });
          }}
        />
      </Router>
    </div>
  );
};

export default Exercise;
