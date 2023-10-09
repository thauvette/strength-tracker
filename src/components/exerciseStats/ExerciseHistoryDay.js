import { h } from 'preact';
import { useRef } from 'preact/hooks';
import dayjs from 'dayjs';
import useIntersectObserver from '../../hooks/useIntersectObserver';
import SetRow from '../setRow/setRow';
import { formatToFixed } from '../../utilities.js/formatNumbers';
import useDayHistoryContext from '../../context/dayHistoryModalContext';

const ExerciseHistoryDay = ({
  items,
  dayKey,
  onChangeSet,
  ormTime,
  includeBwInHistory = false,
  updatePlanedSet,
}) => {
  const ref = useRef(null);
  const isIntersecting = useIntersectObserver({
    ref,
  });
  const { showDayHistory } = useDayHistoryContext();
  return (
    <div ref={ref}>
      <div class="pb-4">
        <div class="flex justify-between">
          <button
            class="border-b-2 pb-1 font-bold"
            onClick={() => showDayHistory(dayjs(dayKey).toDate())}
          >
            <p class="font-medium">{dayjs(dayKey).format('MMM DD, YYYY')}</p>
          </button>
          <button
            class="underline"
            onClick={() => {
              updatePlanedSet(
                items.map((set) => ({
                  weight: set.weight,
                  reps: set.reps,
                  isWarmUp: set.isWarmUp,
                })),
              );
            }}
          >
            Repeat
          </button>
        </div>

        <div class="py-2">
          {items.map((item) => {
            const weight = includeBwInHistory
              ? formatToFixed(+item.weight + (item.bw ? +item.bw : 0))
              : +item.weight;
            return (
              <div key={item.created}>
                <div
                  class={`${
                    ormTime === item.created
                      ? 'bg-blue-200 dark:bg-blue-900'
                      : ''
                  }`}
                >
                  <SetRow
                    set={{ ...item, weight }}
                    onChangeSet={onChangeSet}
                    isIntersecting={isIntersecting}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExerciseHistoryDay;
