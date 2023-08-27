import { h } from 'preact';
import useSessionContext from '../../context/sessionData/sessionData';
import PlannedWorkout from '../PlannedWorkout';
import useDB from '../../context/db/db.tsx';

// TODO: - freeForm sets
// TODO - UX all the way through from creating routines
const ActiveRoutine = () => {
  const { activeRoutine, startRoutine } = useSessionContext();
  const { createOrUpdateLoggedSet } = useDB();

  const onUpdateSet = (set, index) => {
    createOrUpdateLoggedSet(set.id, {
      weight: set.weight,
      reps: set.reps,
      exercise: set.exercise,
      isWarmUp: set.isWarmUp,
    }).then((res) => {
      // add the id to the matching set
      const currentSets = [...activeRoutine];

      currentSets[index] = {
        ...res,
        exerciseName: set.exerciseName,
      };
      startRoutine(currentSets);
    });
  };

  if (!activeRoutine?.length) {
    return <p>No active routine</p>;
  }
  return (
    <div class="px-2">
      <PlannedWorkout
        sets={activeRoutine}
        onUpdateSet={onUpdateSet}
        showHistoryInSets
        showLinkToExercise
      />
    </div>
  );
};

export default ActiveRoutine;
