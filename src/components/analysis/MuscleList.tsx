import { h } from 'preact';
import { HydratedSet } from '../../context/db/types';

interface Props {
  title: string;
  data?: {
    [key: string | number]: {
      id: number | string;
      name: string;
      sets: HydratedSet[];
    };
  };
}

const MuscleList = ({ title, data }: Props) => {
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
            <p
              key={group.id}
              class="capitalize"
            >{`${group.name} ${group.sets.length} sets (${sets?.working.length}
                working)`}</p>
          );
        })}
    </div>
  );
};

export default MuscleList;
