import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import useSessionContext from '../../context/sessionData/sessionData';
import { routes } from '../../config/routes';
import { AugmentedDataSet } from '../../context/db/types';
import LogGroup from './LogGroup';
import LogSet from './logSet';
import useQuickSetAdd from '../../context/quickAddSetModalContext';

interface Props {
  activeDayData: AugmentedDataSet[];
  isToday: boolean;
  openExerciseModal?: (id: number) => void;
}

const ExerciseLists = ({
  activeDayData,
  isToday,
  openExerciseModal,
}: Props) => {
  const [view, setView] = useState('groups');
  const { startRoutine } = useSessionContext();
  const { launchQuickAdd } = useQuickSetAdd();

  const sortedDayData: {
    [key: string]: AugmentedDataSet[];
  } = activeDayData.reduce((obj, exercise) => {
    const key = exercise.name;

    const currentExerciseSets: AugmentedDataSet[] = obj[key] || [];
    currentExerciseSets.push(exercise);
    return {
      ...obj,
      [key]: currentExerciseSets,
    };
  }, {});
  const useDayAsRoutine = () => {
    const sets =
      activeDayData?.map(
        ({ exercise, name, reps, weight, isWarmUp, barWeight }) => ({
          exercise,
          exerciseName: name,
          reps,
          weight,
          isWarmUp,
          barWeight: barWeight || 45,
        }),
      ) || [];
    startRoutine(sets);
    route(routes.activeRoutine);
  };

  return (
    <>
      <div class="flex justify-between pb-6">
        <button
          class="link underline"
          onClick={() => setView(view === 'groups' ? 'order' : 'groups')}
        >
          {view === 'groups' ? 'View in Order' : 'View in Groups'}
        </button>
        {!isToday && (
          <button class="hollow" onClick={useDayAsRoutine}>
            Do workout
          </button>
        )}
      </div>
      {view === 'groups'
        ? Object.entries(sortedDayData).map(([name, sets]) => {
            const lastSet = sets[sets.length - 1];
            return (
              <LogGroup
                key={name}
                name={name}
                sets={sets}
                quickAdd={
                  isToday
                    ? () => {
                        launchQuickAdd({
                          id: sets?.[0]?.exercise,
                          exerciseName: name,
                          initialValues: {
                            weight: lastSet.weight,
                            reps: lastSet.reps,
                            isWarmUp: !!lastSet.isWarmUp,
                          },
                        });
                      }
                    : null
                }
                openExerciseModal={openExerciseModal}
              />
            );
          })
        : activeDayData?.map((set) => <LogSet key={set.created} set={set} />)}
    </>
  );
};

export default ExerciseLists;
