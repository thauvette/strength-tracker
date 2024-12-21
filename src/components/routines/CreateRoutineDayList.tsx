import { h } from 'preact';
import Icon from '../icon/Icon';
import { Link } from 'preact-router';
import { routes } from '../../config/routes';
import EditableSetList from '../EditableSetList';
import Accordion from '../accordion/accordion';
import Body from '../async/body';
import { RoutineSet } from '../../types/types';
import useAugmentSetData from '../../hooks/useAugmentSetData';

interface Props {
  routineName: string;
  setRoutineName: (name: string) => void;
  days: { id: string; name: string; sets: RoutineSet[] }[];
  updateDayName: (id: string, name: string) => void;
  removeDay: (id: string) => void;
  addDay: () => void;
  updateDaySets: (id: string, sets: RoutineSet[]) => void;
  submit: () => void;
}

const getUniqueExerciseIds = (days: Props['days']) => {
  return days.reduce((arr, day) => {
    day?.sets?.forEach(({ exercise }) => {
      if (!arr.includes(exercise)) {
        arr.push(exercise);
      }
    });
    return arr;
  }, []);
};

const CreateRoutineDayList = ({
  routineName,
  setRoutineName,
  days,
  updateDayName,
  removeDay,
  addDay,
  updateDaySets,
  submit,
}: Props) => {
  const exerciseIds = getUniqueExerciseIds(days);
  const exerciseData = useAugmentSetData({ exerciseIds });
  const musclesWorked = Object.values(exerciseData || {}).reduce<{
    activePrimary: number[];
    activeSecondary: number[];
  }>(
    (obj, item) => {
      if (item?.data?.primaryMuscleIds) {
        obj.activePrimary = obj.activePrimary.concat(
          item.data.primaryMuscleIds,
        );
      }
      if (item?.data?.secondaryMuscleIds) {
        obj.activeSecondary = obj.activeSecondary.concat(
          item.data.secondaryMuscleIds,
        );
      }

      return obj;
    },
    {
      activePrimary: [],
      activeSecondary: [],
    },
  );
  return (
    <div class="px-2 py-4">
      <h1>New Routine</h1>
      <div class="mb-4">
        <label>
          <p>Routine Name</p>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={routineName}
            onInput={(e) => {
              if (e.target instanceof HTMLInputElement) {
                setRoutineName(e.target.value);
              }
            }}
          />
        </label>
      </div>
      {days.map((day) => (
        <div key={day.id} class="py-4 border-b-2">
          <div class="flex justify-between">
            <input
              type="text"
              value={day.name || ''}
              onInput={(e) => {
                if (e.target instanceof HTMLInputElement) {
                  updateDayName(day.id, e.target.value);
                }
              }}
            />
            <button
              class="flex items-center gap-1  text-sm"
              onClick={() => removeDay(day.id)}
              aria-label="remove day"
            >
              <Icon name="trash-outline" />
            </button>
          </div>
          <Accordion title={`Sets: (${day.sets.length})`}>
            {day.sets.length ? (
              <EditableSetList
                sets={day.sets}
                setSets={(newSets) => {
                  updateDaySets(day.id, newSets);
                }}
              />
            ) : (
              <p>No sets</p>
            )}
          </Accordion>
          <div class="mt-4 flex">
            <Link
              class="secondary py-2 w-full text-center"
              href={`${routes.routinesNew}/${day.id}`}
            >
              Add/Edit/Analyse
            </Link>
          </div>
        </div>
      ))}
      <div class="py-8">
        <button class="hollow w-full" onClick={addDay}>
          + Add a day
        </button>
      </div>
      <div class="mx-auto max-w-[10rem]">
        <Body {...musclesWorked} />
      </div>
      <div class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
        <button class="primary w-full" onClick={submit}>
          Save Routine
        </button>
      </div>
    </div>
  );
};

export default CreateRoutineDayList;
