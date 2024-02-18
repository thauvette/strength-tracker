import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';

import get from 'lodash.get';
import Accordion from '../../components/accordion/accordion.tsx';
import useDB from '../../context/db/db.tsx';
import WendlerCycleDay from './WendlerCycleDay';

const isWeekComplete = (week, isLegacyVersion, cycle) =>
  Object.values(week).every((day) => {
    const dayIsComplete = day.isComplete;
    const runningSets = isLegacyVersion
      ? day.runningSets
      : day.runningSets.map((setKey) => get(cycle, `weeks.${setKey}`));

    return dayIsComplete || runningSets.every((set) => !!set.completed);
  });

const formatResponse = (res) => {
  let firstUnfinishedWeek = Object.entries(res?.weeks || {}).find(
    ([, data]) => {
      return !isWeekComplete(data, !res?.version, res);
    },
  );

  return {
    ...res,
    weekToDo: firstUnfinishedWeek?.[0],
  };
};

export default function WendlerCycle({ id }) {
  const { getWendlerCycle, updateWendlerItem } = useDB();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    getWendlerCycle(id).then((res) => setWorkout(formatResponse(res)));
  }, [getWendlerCycle, id]);

  if (!workout) {
    return <p>Workout not found</p>;
  }

  const toggleDayComplete = ({ weekKey, mainLift }) => {
    const isComplete = get(
      workout,
      ['weeks', weekKey, mainLift, 'isComplete'],
      false,
    );

    updateWendlerItem({
      id,
      path: ['weeks', weekKey, mainLift, 'isComplete'],
      value: !isComplete,
    }).then((res) => setWorkout(formatResponse(res)));
  };

  const isLegacyVersion = !workout?.version;

  const formatRunningSets = (sets) =>
    isLegacyVersion
      ? sets
      : sets.map((setKey) => get(workout, `weeks.${setKey}`));

  const isDayComplete = (sets) =>
    sets.isComplete ||
    formatRunningSets(sets.runningSets).every((set) => !!set.completed);

  const getDaysSets = (day) => {
    if (isLegacyVersion) {
      const mainSets =
        day?.runningSets?.length > 0
          ? day.runningSets.filter((set) => set.wendlerGroup === 'main')
          : [];

      const auxSets =
        day?.runningSets?.length > 0
          ? day.runningSets.filter((set) => set.wendlerGroup === 'aux')
          : [];

      const additionalSets =
        day?.runningSets?.length > 0
          ? day.runningSets.filter((set) => set.wendlerGroup === 'additional')
          : [];
      return {
        mainSets,
        auxSets,
        additionalSets,
      };
    }

    return {
      mainSets: Object.values(day?.main || {}),
      auxSets: Object.values(day?.aux || {}),
      additionalSets: Object.values(day?.additional || {}),
    };
  };

  return (
    <div class="px-2">
      <div class="pb-4 border-b-2 mb-4">
        <p>{workout.title}</p>
        <p>{workout.description}</p>
      </div>

      {Object.entries(workout?.weeks || {}).map(([num, week]) => {
        const weekIsComplete = isWeekComplete(week, isLegacyVersion, workout);

        return (
          <div key={num} class="bg-1 mb-4 rounded-md">
            <Accordion
              title={`Week ${num}`}
              titleClass="font-bold text-xl"
              openByDefault={+workout?.weekToDo === +num}
              headerClassName="bg-2"
              headerIcon={weekIsComplete ? 'checkmark' : null}
            >
              {Object.entries(week || {}).map(([exercise, sets], i) => {
                const isLastChild = Object.keys(week || {})?.length - 1 === i;
                const dayIsComplete = isDayComplete(sets);

                const { mainSets, auxSets, additionalSets } = getDaysSets(sets);
                return (
                  <div key={exercise} className="px-2 py-1">
                    <div className={`${isLastChild ? '' : 'border-b-2'}`}>
                      <Accordion
                        title={sets?.exercise}
                        titleClass="uppercase font-bold text-sm"
                        headerIcon={dayIsComplete ? 'checkmark-outline' : null}
                      >
                        <div className="border-b-1 pl-2">
                          <WendlerCycleDay
                            runningSets={formatRunningSets(sets.runningSets)}
                            mainSets={mainSets}
                            auxSets={auxSets}
                            additionalSets={additionalSets}
                            mainExercise={sets?.exercise}
                            auxName={sets.auxName}
                          />

                          <div class="py-4 ">
                            <div class="pb-4 flex">
                              <Link
                                class="uppercase primary px-2 py-3 text-base no-underline w-full text-center"
                                href={`/wendler/${id}/${num}/${exercise}`}
                              >
                                Do workout
                              </Link>
                            </div>
                            <div class="pb-4">
                              <button
                                class="uppercase blue px-2 py-3 text-base w-full"
                                onClick={() =>
                                  toggleDayComplete({
                                    weekKey: num,
                                    mainLift: exercise,
                                  })
                                }
                              >
                                {sets.isComplete
                                  ? 'Mark day incomplete'
                                  : 'Mark day complete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </Accordion>
                    </div>
                  </div>
                );
              })}
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
