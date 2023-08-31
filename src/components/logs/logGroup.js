import { h } from 'preact';
import { Link } from 'preact-router';
import dayjs from 'dayjs';
import { routes } from '../../config/routes';
import Icon from '../icon/Icon';
import dateFormats from '../../config/dateFormats';

const LogGroup = ({ name, sets, toggleActive, quickAdd }) => (
  <div key={name} class="mb-4 card p-4 ">
    <div class="flex justify-between pb-2">
      <button onClick={toggleActive} class="font-bold capitalize pl-0">
        {name}
      </button>
      {sets?.[0]?.exercise && (
        <Link
          href={`${routes.exerciseBase}/${sets[0].exercise}`}
          ariaLabel={`go to ${name}`}
        >
          <Icon name="open" />
        </Link>
      )}
    </div>

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
    {quickAdd && <button onClick={quickAdd}>+ Quick Add</button>}
  </div>
);

export default LogGroup;
