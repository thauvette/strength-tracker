import dayjs from 'dayjs';
import { useState } from 'preact/hooks';
import Accordion from '../accordion/accordion';
import { HydratedSet } from '../../context/db/types';

interface Props {
  // TODO: exerciseHistory interface needs to be declared in that hook.
  exerciseHistory: {
    items: {
      [key: string]: HydratedSet[];
    };
  };
}

const StatsByWeight = ({ exerciseHistory }: Props) => {
  const [sortBy, setSortBy] = useState<'best' | 'date'>('best');
  const setAnalysis = Object.entries(exerciseHistory?.items || {}).reduce(
    (obj, [day, sets]) => {
      const setsByWeight = sets.reduce((setObj, set) => {
        if (set.isWarmUp) {
          return setObj;
        }
        const current = setObj[set.weight];
        const currentSets = current?.sets || [];
        currentSets.push(set);
        const reps = currentSets.map((set) => set.reps);
        const minReps = Math.min(...reps);
        return {
          ...setObj,
          [set.weight]: {
            ...(current || {}),
            weight: set.weight,
            sets: currentSets,
            minReps,
            maxReps: Math.max(...reps),
            totalReps: set.reps + (current?.totalReps || 0),
            date: day,
            totalVolume: currentSets.reduce((num, { weight, reps }) => {
              return num + weight * reps;
            }, 0),
          },
        };
      }, {});
      Object.entries(setsByWeight || {}).forEach(([weight, stats]) => {
        const current = obj[weight] || [];
        current.push(stats);
        obj[weight] = current;
      });

      return obj;
    },
    {},
  );

  const orderedKeys = Object.keys(setAnalysis).sort((a, b) => +b - +a);

  return (
    <div>
      {orderedKeys.map((key) => {
        const data = setAnalysis[key];
        const sortedData = data.sort((current, next) => {
          if (sortBy === 'best') {
            return next.totalVolume - current.totalVolume;
          }
          return dayjs(next.date).isBefore(dayjs(current.date)) ? -1 : 1;
        });
        const best = sortedData.reduce((obj, day) => {
          if (!obj.totalVolume || day.totalVolume > obj.totalVolume) {
            return day;
          }
          return obj;
        }, {});
        const text = best
          ? `Best: ${best.sets.length} sets @ ${best.minReps}+ reps`
          : null;

        return (
          <Accordion
            key={key}
            containerClass="card mb-2"
            titleClass="text-left"
            title={
              <>
                Weight: {key}.<br />
                <span class="text-sm">{text}</span>
              </>
            }
          >
            <div>
              <div class="flex items-center gap-2 py-4">
                <p>Sort by:</p>
                <button
                  class={`text-sm ${
                    sortBy === 'best' ? 'primary' : 'secondary'
                  }`}
                  onClick={() => setSortBy('best')}
                >
                  Best
                </button>
                <button
                  class={`text-sm ${
                    sortBy === 'date' ? 'primary' : 'secondary'
                  }`}
                  onClick={() => setSortBy('date')}
                >
                  Date
                </button>
              </div>
              <div class="divide-y">
                {sortedData?.length
                  ? sortedData.map((data) => (
                      <div key={data.date} class="p-2">
                        <div class="flex justify-between">
                          <p class="font-bold">
                            {dayjs(data.date).format("MMM DD 'YY")}
                          </p>
                          <p>vol: {data.totalVolume}</p>
                        </div>
                        <p>
                          {data.sets.length} sets{' @ '}
                          {data.sets.map(({ reps }) => reps).join(', ')}
                          {' for '}
                          {data.totalReps} reps
                          <br />
                        </p>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </Accordion>
        );
      })}
    </div>
  );
};

export default StatsByWeight;
