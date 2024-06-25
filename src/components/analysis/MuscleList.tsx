import { h } from 'preact';
import { HydratedSet } from '../../context/db/types';
import { formatToFixed } from '../../utilities.js/formatNumbers';
import Accordion from '../accordion/accordion';

interface Props {
  title: string;
  data?: {
    [key: string | number]: {
      id: number | string;
      name: string;
      sets: HydratedSet[];
    };
  };
  workingSets: number;
}

const MuscleList = ({ title, data, workingSets }: Props) => {
  const groups = Object.values(data || {});

  if (!groups.length) {
    return null;
  }
  return (
    <div class="mb-4 px-2">
      <h1 class="mb-4">{title}</h1>

      {groups
        .sort((a, b) => (a.sets.length > b.sets?.length ? -1 : 1))
        .map((group) => {
          const exercises: {
            [key: string]: {
              name: string;
              sets: HydratedSet[];
              workingSets: number;
            };
          } = {};

          const sets = group.sets.reduce(
            (obj, set) => {
              exercises[set.exercise] = exercises[set.exercise]
                ? {
                    ...exercises[set.exercise],
                    sets: [...exercises[set.exercise].sets, set],
                    workingSets:
                      exercises[set.exercise].workingSets +
                      (set.isWarmUp ? 0 : 1),
                  }
                : {
                    name: set.name,
                    sets: [set],
                    workingSets: set.isWarmUp ? 0 : 1,
                  };

              const key = set.isWarmUp ? 'warmUp' : 'working';
              obj[key].push(set);
              return obj;
            },
            {
              working: [],
              warmUp: [],
            },
          );
          return (
            <Accordion
              key={group.id}
              titleClass="capitalize text-sm font-bold"
              containerClass="card mb-2"
              title={
                <p>
                  {`${group.name} ${group.sets.length} sets (${sets?.working.length}
              working)`}{' '}
                  - {formatToFixed((group.sets.length / workingSets) * 100)}%
                </p>
              }
            >
              <ul class="p-2 text-sm">
                {Object.values(exercises)
                  .sort(
                    (current, next) => next.sets.length - current.sets.length,
                  )
                  .map((exercise) => (
                    <li key={exercise.name} class="capitalize mb-2 pl-1">
                      {exercise.name} {exercise.sets?.length || 0} sets (
                      {exercise.workingSets} working)
                    </li>
                  ))}
              </ul>
            </Accordion>
          );
        })}
    </div>
  );
};

export default MuscleList;
