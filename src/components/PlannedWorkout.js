import { h } from 'preact';
import { Link } from 'preact-router';
import { useCallback, useState } from 'preact/hooks';
import { AnimatePresence, motion } from 'framer-motion';

import EditableSet from './editableSet/editableSet.tsx';
import ExerciseHistoryModal from './exerciseHistoryModal/ExerciseHistoryModal';
import Icon from './icon/Icon';
import { routes } from '../config/routes';
import useExerciseHistory from '../hooks/useExerciseHistory/useExerciseHistory';
import useToast from '../context/toasts/Toasts';
const PlannedWorkout = ({
  sets,
  onSaveSet,
  onUpdateSet,
  showHistoryInSets,
  showLinkToExercise,
}) => {
  const { fireToast } = useToast();
  const firstIncompleteSet = sets
    .map(({ created }) => created)
    .indexOf(undefined);
  const [activeSet, setActiveSet] = useState(
    firstIncompleteSet >= 0 ? firstIncompleteSet : 0,
  );

  const [exerciseModalState, setExerciseModalState] = useState({
    id: null,
    isOpen: false,
  });

  const { exerciseHistory, getData } = useExerciseHistory(
    exerciseModalState.id,
  );

  const saveSet = (set, index) => {
    setActiveSet(index + 1);
    onSaveSet(set, index);
    fireToast({
      text: `Set Saved`,
    });
  };

  const openExerciseModal = useCallback((id) => {
    setExerciseModalState({
      id,
      isOpen: true,
    });
  }, []);

  const closeExerciseModal = useCallback(
    () =>
      setExerciseModalState({
        id: null,
        isOpen: false,
      }),
    [],
  );

  return (
    <div>
      {sets.map((set, i) => {
        const {
          reps,
          weight,
          created,
          exerciseName,
          exercise,
          isWarmUp,
          barWeight,
        } = set;
        const isActiveSet = i === activeSet;
        return (
          <div
            key={i}
            class={`border-b-4 pb-2 mb-4 ${
              isActiveSet ? '' : 'opacity-85 text-sm'
            }`}
          >
            <button
              class={`w-full ${isActiveSet ? 'text-lg font-bold' : 'text-sm'}`}
              onClick={() => setActiveSet(i === activeSet ? null : i)}
            >
              <div class="flex flex-wrap items-center">
                {created && <Icon name="checkmark-outline" width={28} />}
                <p class="capitalize  text-left">{exerciseName}</p>
                <p class="ml-auto">
                  {reps} @ {weight}
                </p>
              </div>
            </button>
            <AnimatePresence>
              {isActiveSet && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  class="pb-2 overflow-hidden"
                >
                  <EditableSet
                    reps={reps}
                    weight={weight}
                    isWarmUp={isWarmUp}
                    barWeight={barWeight}
                    largeText
                    handleChanges={
                      onUpdateSet
                        ? (args) => {
                            onUpdateSet(
                              {
                                ...set,
                                ...args,
                              },
                              i,
                            );
                          }
                        : null
                    }
                    renderCtas={({ reps, weight, isWarmUp }) => {
                      return (
                        <div>
                          <button
                            onClick={() =>
                              saveSet({ ...set, reps, weight, isWarmUp }, i)
                            }
                            class="primary w-full"
                          >
                            {created ? 'Update' : 'Save'}
                          </button>
                          <div class="flex items-center justify-between gap-2 pt-4 ">
                            {showHistoryInSets && (
                              <button
                                class="secondary flex-1"
                                onClick={() => openExerciseModal(set.exercise)}
                              >
                                <div class="flex items-center justify-center gap-2">
                                  <Icon name="list-outline" />
                                  <p>History</p>
                                </div>
                              </button>
                            )}
                            {showLinkToExercise && (
                              <Link href={`${routes.exerciseBase}/${exercise}`}>
                                Go to {exerciseName}
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      {exerciseModalState.isOpen &&
        exerciseHistory?.id === exerciseModalState?.id && (
          <ExerciseHistoryModal
            isOpen={exerciseModalState.isOpen}
            onRequestClose={closeExerciseModal}
            onUpdate={getData}
            exerciseHistory={exerciseHistory}
          />
        )}
    </div>
  );
};

export default PlannedWorkout;
