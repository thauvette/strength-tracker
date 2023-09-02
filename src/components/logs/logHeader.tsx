import { h } from 'preact';
import dayjs from 'dayjs';
import dateFormats from '../../config/dateFormats';
import Body from '../async/body';

interface Props {
  activeDayData: {
    created: number;
  }[];
  selectedExercise?: {
    name: string;
  };
  clearSelectedExercise: () => void;
  musclesWorked: {
    activePrimary: number[];
    activeSecondary: number[];
  };
}

const LogHeader = ({
  activeDayData,
  selectedExercise,
  clearSelectedExercise,
  musclesWorked,
}: Props) => {
  const times = activeDayData?.map((item) => item.created) || [];
  const earliestSet = times?.length ? Math.min(...times) : null;
  const lasSet = times?.length ? Math.max(...times) : null;
  return (
    <div class="px-8 pb-4">
      {earliestSet && lasSet && (
        <p class="text-center">
          {dayjs(earliestSet).format(dateFormats.timeToSeconds)}
          {' to '}
          {dayjs(lasSet).format(dateFormats.timeToSeconds)} (
          {dayjs(lasSet).diff(earliestSet, 'minutes')} mins)
        </p>
      )}
      <div class="px-8 pb-4">
        <div class="flex items-center justify-center gap-4 pb-4 text-lg">
          <p class="capitalize">{selectedExercise?.name || 'Workout'}</p>
          {selectedExercise ? (
            <button class="p-0" onClick={clearSelectedExercise}>
              X
            </button>
          ) : null}
        </div>
        <div className="max-w-[10rem] mx-auto">
          <Body {...musclesWorked} />
        </div>
      </div>
    </div>
  );
};

export default LogHeader;
