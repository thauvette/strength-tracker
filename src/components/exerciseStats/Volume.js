import dayjs from 'dayjs';
import { h } from 'preact';
import { useState } from 'react';
import AnimateHeight from 'react-animate-height';

import { formatToFixed } from '../../utilities.js/formatNumbers';

const VolumeRow = ({ day }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <div class="border-b-4">
      <button
        disabled={!day.items?.length}
        class="p-0 w-full"
        onClick={toggleOpen}
      >
        <div class={'flex items-center justify-between py-4'}>
          <p class="text-sm">
            {dayjs(day.day).format("MMM DD 'YY")} -{' '}
            {day.workingSets || day.sets} sets - {day.workingReps} reps
          </p>
          <p>
            {day.diff !== undefined && day.diff !== null && (
              <span class="text-sm">
                ({day.diff > 0 ? '+' : ''}
                {formatToFixed(day.diff)})
              </span>
            )}{' '}
            <span class="text-sm font-bold">{day.workingVol}</span>
          </p>
        </div>
      </button>

      <AnimateHeight height={isOpen ? 'auto' : 0}>
        <div class="pb-4">
          {day?.items?.length > 0
            ? day.items.map((set) => (
                <p key={set.created}>
                  {set.reps} @ {set.weight} {set.isWarmUp ? '(warm up)' : ''}
                </p>
              ))
            : null}
        </div>
      </AnimateHeight>
    </div>
  );
};

const Volume = ({ exerciseHistory, includeBwInHistory }) => {
  const volumeByDay = exerciseHistory?.items
    ? Object.entries(exerciseHistory?.items).reduce((arr, [day, items]) => {
        const volumeData = items.reduce(
          (obj, set) => {
            const isWorkingSet = !set.isWarmUp;

            const weight = includeBwInHistory
              ? +set.weight + (+set.bw || 0)
              : +set.weight;

            return {
              ...obj,
              totalVol: formatToFixed(obj.totalVol + weight * set.reps),
              workingVol: isWorkingSet
                ? formatToFixed(obj.workingVol + weight * set.reps)
                : formatToFixed(obj.workingVol),
              workingSets: isWorkingSet
                ? +obj.workingSets + 1
                : obj.workingSets,
              workingReps: isWorkingSet
                ? obj.workingReps + +set.reps
                : obj.workingReps,
            };
          },
          {
            totalVol: 0,
            workingVol: 0,
            workingSets: 0,
            workingReps: 0,
          },
        );
        arr.push({
          day,
          vol: volumeData.totalVol,
          sets: items.length,
          items,
          ...volumeData,
        });
        return arr;
      }, [])
    : [];

  return volumeByDay
    .sort((a, b) => (dayjs(a.day).isBefore(b.day) ? 1 : -1))
    .map((day, i) => {
      const diff = volumeByDay[i + 1]?.workingVol
        ? day.workingVol - volumeByDay[i + 1]?.workingVol
        : null;

      return <VolumeRow key={day.day} day={{ ...day, diff }} />;
    });
};

export default Volume;
