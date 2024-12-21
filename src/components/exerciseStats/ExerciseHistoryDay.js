import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import dayjs from 'dayjs';
import AnimateHeight from 'react-animate-height';

import useIntersectObserver from '../../hooks/useIntersectObserver';
import SetRow from '../setRow/setRow';
import { formatToFixed } from '../../utilities.js/formatNumbers';
import useDayHistoryContext from '../../context/dayHistoryModalContext';
import Icon from '../icon/Icon';

const ExerciseHistoryDay = ({
  items,
  dayKey,
  onChangeSet,
  ormTime,
  includeBwInHistory = false,
  updatePlanedSet,
  reuseCta,
  volume,
  previousVolume,
  openByDefault,
}) => {
  const ref = useRef(null);
  const isIntersecting = useIntersectObserver({
    ref,
  });
  const [isOpen, setIsOpen] = useState(openByDefault);
  const { showDayHistory } = useDayHistoryContext();
  const volumeDiff =
    volume?.workingVol && previousVolume?.workingVol
      ? volume.workingVol - previousVolume.workingVol
      : null;
  const toggleOpen = () => setIsOpen((current) => !current);
  return (
    <div ref={ref} class="card mb-4">
      <div class="p-1">
        <button class="text-left w-full" onClick={() => toggleOpen()}>
          <div class={'w-full  text-sm text-left flex'}>
            <p
              class="text-base text-left pl-0 font-bold"
              // onClick={() => showDayHistory(dayjs(dayKey).toDate())}
            >
              {dayjs(dayKey).format('MMM DD, YYYY')}
            </p>

            <div class="ml-auto">
              <Icon name="chevron-down-outline" />
            </div>
          </div>
          <div>
            <p class="text-sm font-medium">Working stats:</p>
            {volume && (
              <p class="text-sm whitespace-normal">
                {volume?.workingSets} sets, {volume.workingReps} reps,{' '}
                {volume.maxWeight} max weight, {volume?.workingVol}
                vol.{' '}
                {volumeDiff !== null && (
                  <>
                    ({volumeDiff > 0 ? '+' : ''}
                    {formatToFixed(volumeDiff)})
                  </>
                )}
              </p>
            )}
          </div>
        </button>
        <AnimateHeight height={isOpen ? 'auto' : 0}>
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
            <div class="flex gap-2 flex-wrap items-center mt-4">
              <button
                class="btn secondary pb-1 font-bold flex-1 text-sm"
                onClick={() => showDayHistory(dayjs(dayKey).toDate())}
              >
                <p class="font-medium">View Day</p>
              </button>
              {updatePlanedSet && (
                <button
                  className="underline flex-1 btn primary text-sm"
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
                  {reuseCta || 'Repeat'}
                </button>
              )}
            </div>
          </div>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default ExerciseHistoryDay;
