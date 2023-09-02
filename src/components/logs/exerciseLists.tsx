import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import useSessionContext from '../../context/sessionData/sessionData';
import { routes } from '../../config/routes';
import { Exercise, SetType } from '../../context/db/types';
import LogGroup from './logGroup';
import LogSet from './logSet';
import useQuickSetAdd from '../../context/quickAddSetModalContext';

type DayEntry = Exercise & SetType;

interface Props {
  activeDayData: DayEntry[];
  isToday: boolean;
  toggleSelectedExercise: (set: {}) => void;
}

const ExerciseLists = ({
  activeDayData,
  isToday,
  toggleSelectedExercise,
}: Props) => {
  const [view, setView] = useState('groups');
  const { startRoutine } = useSessionContext();
  const { launchQuickAdd } = useQuickSetAdd();

  const sortedDayData = activeDayData.reduce((obj, exercise) => {
    const key = exercise.name;

    const currentExerciseSets = obj[key] || [];
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
        ? Object.entries(sortedDayData).map(([name, sets]) => (
            <LogGroup
              key={name}
              name={name}
              sets={sets}
              toggleActive={() => toggleSelectedExercise(sets?.[0])}
              quickAdd={
                isToday ? () => launchQuickAdd(sets?.[0].exercise) : null
              }
            />
          ))
        : activeDayData?.map((set) => (
            <LogSet
              key={set.created}
              set={set}
              toggleActive={() => toggleSelectedExercise(set)}
            />
          ))}
    </>
  );
};

export default ExerciseLists;
