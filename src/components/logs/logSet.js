import { h } from 'preact'
import { Link } from 'preact-router'
import { routes } from '../../config/routes'
import Icon from '../icon/Icon'

const LogSet = ({ set, toggleActive }) => (
  <div class="bg-gray-200 odd:bg-gray-50 dark:bg-gray-900 dark:odd:bg-gray-800 px-2 py-4">
    <div class="flex gap-2 ">
      <div class="text-sm">
        <button class="font-bold capitalize text-sm" onClick={toggleActive}>
          {set.name}{' '}
          {set.isWarmUp ? (
            <span class="text-xs font-normal">(warm up)</span>
          ) : null}
          <p class="whitespace-nowrap text-left">
            {set.reps} @ {set.weight}
          </p>
        </button>
      </div>
      <Link
        class="ml-auto pt-2"
        href={`${routes.exerciseBase}/${set.exercise}`}
        ariaLabel={`go to ${set.name}`}
      >
        <Icon name="open" />
      </Link>
    </div>

    {set.note && (
      <div class="pt-2">
        <p>{set.note}</p>
      </div>
    )}
  </div>
)

export default LogSet
