import { h } from 'preact';
import useSessionContext from '../../context/sessionData/sessionData';
import PlannedWorkout from '../PlannedWorkout';
import useDB from '../../context/db/db';
import { useState } from 'preact/hooks';
import Modal from '../modal/Modal';
import AddExerciseForm, { SubmittedSet } from './AddExerciseForm';

const ActiveRoutine = () => {
  const { activeRoutine, startRoutine, updatePlanedSet, addToRoutine } =
    useSessionContext();

  const { createOrUpdateLoggedSet, updateSingleRoutineSet } = useDB();
  const [addExerciseModalIsOpen, setAddExerciseModalIsOpen] = useState(false);
  console.log(activeRoutine);
  const onSaveSet = (set: SubmittedSet, index: number) => {
    console.log(set);
    const { dayId, routineId, routineSetId } = set;
    createOrUpdateLoggedSet(set.id, {
      weight: set.weight,
      reps: set.reps,
      exercise: set.exercise,
      isWarmUp: set.isWarmUp,
    }).then((res) => {
      console.log(res);
      // add the id to the matching set
      const currentSets = [...activeRoutine];
      currentSets[index] = {
        ...set,
        ...res,
      };

      if (dayId && routineId && routineSetId) {
        void updateSingleRoutineSet(+routineId, dayId, set);
      }
      startRoutine(currentSets);
    });
  };

  const addExercises = (sets: SubmittedSet[]) => {
    addToRoutine(
      sets.map((set) => ({
        ...set,
      })),
    );
    setAddExerciseModalIsOpen(false);
  };

  return (
    <div class="px-2">
      {activeRoutine?.length ? (
        <PlannedWorkout
          sets={activeRoutine}
          onSaveSet={onSaveSet}
          onUpdateSet={updatePlanedSet}
          showHistoryInSets
          showLinkToExercise
        />
      ) : (
        <div class="text-center">
          <p class="mb-8  ">No active routine</p>
        </div>
      )}
      <div class="mt-4">
        <button
          class="primary w-full"
          onClick={() => setAddExerciseModalIsOpen(true)}
        >
          + Add exercise
        </button>
      </div>
      <Modal
        isOpen={addExerciseModalIsOpen}
        onRequestClose={() => setAddExerciseModalIsOpen(false)}
      >
        <div>
          <AddExerciseForm
            submit={addExercises}
            addFromHistory={addExercises}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ActiveRoutine;
