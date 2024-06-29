import dayjs from 'dayjs';
import Accordion from '../accordion/accordion';
import { HydratedSet } from '../../context/db/types';

interface Props {
  // TODO: exerciseHistory interface needs to be decalired in that hook.
  exerciseHistory: {
    items: {
      [key: string]: HydratedSet[];
    };
  };
}

const StatsByWeight = ({ exerciseHistory }: Props) => {
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
  const orderedKeys = Object.keys(setAnalysis).reverse();

  return (
    <div>
      {orderedKeys.map((key) => {
        const data = setAnalysis[key];
        const sortedData = data.sort(
          (current, next) => next.totalVolume - current.totalVolume,
        );
        const best = sortedData[0];
        const text = best
          ? `Best: ${best.sets.length} sets @ ${best.minReps}+ reps`
          : null;

        return (
          <Accordion
            key={key}
            containerClass="card mb-2"
            title={
              <>
                <p>
                  Weight: {key}. {text}
                </p>
              </>
            }
          >
            <div>
              {sortedData?.length
                ? sortedData.map((data) => (
                    <Accordion
                      containerClass="px-4 text-sm border-b"
                      key={data.date}
                      title={
                        <p class="text-sm">
                          {dayjs(data.date).format('MMM DD YYYY')}:{' '}
                          {data.sets.length} sets @ {data.minReps}+ reps
                        </p>
                      }
                    >
                      <div key={data.date} className="px-4">
                        <p>Volume: {data.totalVolume}</p>
                        {data.sets
                          .sort(
                            (current, next) => current.created - next.created,
                          )
                          .map((set) => (
                            <p key={set.created}>
                              {set.reps} @ {set.weight}
                            </p>
                          ))}
                      </div>
                    </Accordion>
                  ))
                : null}
            </div>
          </Accordion>
        );
      })}
    </div>
  );
};

export default StatsByWeight;
