import { h } from 'preact';

import Plan from './Plan';
import PlannedWorkout from './PlannedWorkout';
import useDB from '../context/db/db.tsx';
import dayjs from 'dayjs';

const PlannedSets = ({
  id,
  onChangeCompleteSet,
  updatePlanedSet,
  plannedSet,
  lastHeavySet,
  addToToday = null,
}) => {
  const { createOrUpdateLoggedSet } = useDB();
  if (!plannedSet) {
    return (
      <>
        {lastHeavySet ? (
          <div class="px-4">
            <p class="font-bold mb-4">
              * Last heavy set: {lastHeavySet.reps} @ {lastHeavySet.weight} on{' '}
              {dayjs(lastHeavySet.created).format('MMM DD YYYY')}
            </p>
          </div>
        ) : null}
        <Plan
          initialWeight={lastHeavySet?.weight}
          updatePlanedSet={(sets) =>
            updatePlanedSet({
              id,
              sets,
            })
          }
          addToToday={addToToday}
        />
      </>
    );
  }

  return (
    <div class="px-4">
      <h1 class="mb-6">Planned sets</h1>
      <PlannedWorkout
        sets={plannedSet || []}
        onSaveSet={({ reps, weight, isWarmUp }, index) => {
          const currentSet = { ...plannedSet[index], reps, weight, isWarmUp };
          // create or update (if setID exists) set in DB
          createOrUpdateLoggedSet(currentSet.id, {
            ...currentSet,
            exercise: +id,
          }).then((res) => {
            updatePlanedSet({
              id,
              sets: plannedSet.map((set, i) => {
                return i === index ? res : set;
              }),
            });
            onChangeCompleteSet({ reps, weight, isWarmUp });
          });
        }}
      />

      <div class="pt-4">
        <button
          class="bg-red-900 text-white"
          onClick={() => updatePlanedSet({ id, sets: null })}
        >
          Remove Planned Set
        </button>
        <p>This will not delete any logged sets</p>
      </div>
    </div>
  );
};

export default PlannedSets;
