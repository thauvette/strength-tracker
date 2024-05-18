import { h } from 'preact';
import useSessionContext from '../../context/sessionData/sessionData';
import PlannedWorkout from '../PlannedWorkout';
import useDB from '../../context/db/db.tsx';

const ActiveRoutine = () => {
  const { activeRoutine, startRoutine, updatePlanedSet } = useSessionContext();
  const { createOrUpdateLoggedSet, updateSingleRoutineSet } = useDB();

  const onSaveSet = (set, index) => {
    const { dayId, routineId, routineSetId } = set;
    createOrUpdateLoggedSet(set.id, {
      weight: set.weight,
      reps: set.reps,
      exercise: set.exercise,
      isWarmUp: set.isWarmUp,
    }).then((res) => {
      // add the id to the matching set
      const currentSets = [...activeRoutine];

      currentSets[index] = {
        ...set,
        ...res,
      };

      if (dayId && routineId && routineSetId) {
        updateSingleRoutineSet(+routineId, dayId, set);
      }
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
        onSaveSet={onSaveSet}
        onUpdateSet={updatePlanedSet}
        showHistoryInSets
        showLinkToExercise
      />
    </div>
  );
};

export default ActiveRoutine;
