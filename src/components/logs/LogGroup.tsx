import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Link } from 'preact-router';
import dayjs from 'dayjs';
import { routes } from '../../config/routes';
import Icon from '../icon/Icon';
import dateFormats from '../../config/dateFormats';

import AnimateHeight from 'react-animate-height';
import useSessionContext from '../../context/sessionData/sessionData';
import { LogsSet } from '../../context/db/types';

const renderSetsSummary = (sets) => {
  const stats = [];
  const total = sets?.length;
  stats.push(`${total} set${total > 1 ? 's' : ''}`);
  const workingSets = sets?.filter((set) => !set.isWarmUp) || [];
  const working = workingSets.length;
  stats.push(`${working} working`);

  const workingVol = workingSets.reduce(
    (num, set) => num + set.reps * set.weight,
    0,
  );
  const volText = workingVol ? `total vol ${workingVol} ` : '';
  if (volText) {
    stats.push(volText);
  }
  const maxWeight = workingSets.length
    ? Math.max(...workingSets.map((set) => set.weight))
    : 0;
  const maxText = maxWeight ? `max weight ${maxWeight}` : '';
  if (maxText) {
    stats.push(maxText);
  }
  return stats.join(', ');
};

interface Props {
  name: string;
  sets: LogsSet[];
  quickAdd: () => void;
  openExerciseModal?: (id: number) => void;
}

const LogGroup = ({ name, sets, quickAdd, openExerciseModal }: Props) => {
  const [toggleIsOpen, setToggleIsOpen] = useState(false);
  const { addToRoutine } = useSessionContext();
  const id = sets[0].exercise;
  const handleOpenExerciseModal = useCallback(() => {
    openExerciseModal(id);
  }, [id, openExerciseModal]);
  return (
    <div class="mb-4 card p-1 ">
      <div class="flex relative">
        {quickAdd && (
          <button class="text-2xl pr-2" onClick={quickAdd}>
            +
          </button>
        )}

        <div class="pl-2">
          <Link
            href={`${routes.exerciseBase}/${id}`}
            aria-label={`go to ${name}`}
            class="font-bold capitalize pl-0 underline"
          >
            {name}
          </Link>
          <p class="text-sm">{renderSetsSummary(sets)}</p>
        </div>
        <button class="ml-auto" onClick={() => setToggleIsOpen(!toggleIsOpen)}>
          <div
            class={`transform transition-all ${
              toggleIsOpen ? 'rotate-180' : ''
            }`}
          >
            <Icon name="chevron-down-outline" />
          </div>
        </button>
      </div>

      <AnimateHeight height={toggleIsOpen ? 'auto' : 0}>
        <div class="p-4 border-t mt-4">
          {sets.map((set) => (
            <div key={set.created}>
              <p>
                {set.reps} @ {set.weight} {set.isWarmUp ? '(warm up)' : ''}{' '}
                <span class="text-sm float-right">
                  {dayjs(set.created).format(dateFormats.timeToSeconds)}
                </span>
              </p>

              {set.note && <p class="pl-2"> - {set.note}</p>}
            </div>
          ))}
          <div class="flex items-center mt-4">
            {openExerciseModal && (
              <button
                class="border border-white "
                onClick={handleOpenExerciseModal}
              >
                View History
              </button>
            )}

            <button
              class="ml-auto underline"
              onClick={() =>
                addToRoutine(
                  sets.map((set) => ({
                    exercise: set.exercise,
                    exerciseName: set.name,
                    reps: set.reps,
                    weight: set.weight,
                    isWarmUp: set.isWarmUp,
                    barWeight: set.barWeight || 45,
                  })),
                )
              }
            >
              Add to today
            </button>
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default LogGroup;
