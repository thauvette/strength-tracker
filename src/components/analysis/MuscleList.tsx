import { h } from 'preact';
import { HydratedSet } from '../../context/db/types';
import { formatToFixed } from '../../utilities.js/formatNumbers';

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
    <div class="mb-4">
      <h1>{title}</h1>

      {groups
        .sort((a, b) => (a.sets.length > b.sets?.length ? -1 : 1))
        .map((group) => {
          const sets = group.sets.reduce(
            (obj, set) => {
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
            <p key={group.id} class="capitalize">
              {`${group.name} ${group.sets.length} sets (${sets?.working.length}
                working)`}{' '}
              - {formatToFixed((group.sets.length / workingSets) * 100)}%
            </p>
          );
        })}
    </div>
  );
};

export default MuscleList;
