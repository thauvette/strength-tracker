import { h } from 'preact';
import dayjs from 'dayjs';
import { useState } from 'preact/hooks';
import { uniq } from 'lodash';
import dateFormats from '../../config/dateFormats';
import Body from '../async/body';

interface Props {
  activeDayData: {
    created: number;
    exercise: number;
    name: string;
    musclesWorked: number[];
    secondaryMusclesWorked: number[];
  }[];
}

const LogHeader = ({ activeDayData }: Props) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  const times = activeDayData?.map((item) => item.created) || [];
  const earliestSet = times?.length ? Math.min(...times) : null;
  const lasSet = times?.length ? Math.max(...times) : null;
  const bodyDiagramOptions =
    activeDayData?.reduce((arr, set) => {
      if (!arr.some((item) => +item.value === +set.exercise)) {
        arr.push({
          value: +set.exercise,
          name: set.name,
          musclesWorked: set.musclesWorked,
          secondaryMusclesWorked: set.secondaryMusclesWorked,
        });
      }
      return arr;
    }, []) || [];

  const selectedExerciseData = selectedExercise
    ? bodyDiagramOptions.find((item) => +item.value === +selectedExercise)
    : null;
  const musclesWorked = selectedExerciseData
    ? {
        activePrimary: selectedExerciseData.musclesWorked,
        activeSecondary: selectedExerciseData.secondaryMusclesWorked,
      }
    : bodyDiagramOptions.reduce(
        (obj, exercise) => {
          const activePrimary = uniq([
            ...obj.activePrimary,
            ...(exercise.musclesWorked || []),
          ]);

          const activeSecondary = uniq([
            ...obj.activeSecondary,
            ...(exercise.secondaryMusclesWorked || []),
          ]);
          return {
            activePrimary,
            activeSecondary,
          };
        },
        {
          activePrimary: [],
          activeSecondary: [],
        },
      ) || {
        activePrimary: [],
        activeSecondary: [],
      };
  return (
    <div class="px-8 pb-4 text-center">
      {earliestSet && lasSet && (
        <p class="text-center">
          {dayjs(earliestSet).format(dateFormats.timeToSeconds)}
          {' to '}
          {dayjs(lasSet).format(dateFormats.timeToSeconds)} (
          {dayjs(lasSet).diff(earliestSet, 'minutes')} mins)
        </p>
      )}
      <select
        value={selectedExercise}
        class="my-2 mx-auto min-h-0"
        onInput={(e: Event) => {
          if (e.target instanceof HTMLSelectElement) {
            setSelectedExercise(e.target.value);
          }
        }}
      >
        <option value="">Workout</option>
        {bodyDiagramOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      <div class="pb-4">
        <div className="max-w-[10rem] mx-auto">
          <Body {...musclesWorked} />
        </div>
      </div>
    </div>
  );
};

export default LogHeader;
