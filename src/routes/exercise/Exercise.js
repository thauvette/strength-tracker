import { h } from 'preact'

import { Router, Link } from 'preact-router'
import dayjs from 'dayjs'
import ExerciseStats from '../../components/exerciseStats/ExerciseStats'
import Track from './Track'
import { routes } from '../../config/routes'
import useExerciseHistory from '../../hooks/useExerciseHistory/useExerciseHistory'
import EditExercise from './EditExercise'

const Exercise = (props) => {
  const { id, remaining_path } = props
  const [exerciseHistory, getData] = useExerciseHistory(id)
  if (!exerciseHistory) {
    return null
  }

  const itemsArrays = Object.values(exerciseHistory?.items || {})
  const lastIndex = Object.values(exerciseHistory?.items || {})?.length
    ? Object.values(exerciseHistory?.items || {})?.length - 1
    : 0

  const lastWorkoutFirstSet =
    itemsArrays?.[lastIndex]?.sort((a, b) =>
      a.create < b.create ? -1 : 1,
    )?.[0] || null

  return (
    <div>
      <div class="px-2">
        <h1 class="capitalize mb-2">{exerciseHistory?.name}</h1>
      </div>
      <div class="flex pb-4">
        <Link
          href={`${routes.exerciseBase}/${id}`}
          class={`px-4 py-2 bg-blue-100 text-gray-800 no-underline border-b-4 border-blue-900 ${
            !remaining_path ? '' : 'border-opacity-0'
          }`}
        >
          Track
        </Link>
        <Link
          href={`${routes.exerciseBase}/${id}/history`}
          class={`px-4 py-2 bg-blue-100  text-gray-800 no-underline border-b-4 border-blue-900 ${
            remaining_path === 'history' ? '' : 'border-opacity-0'
          }`}
        >
          History
        </Link>
        <Link
          href={`${routes.exerciseBase}/${id}/edit`}
          class={`px-4 py-2 bg-blue-100  text-gray-800 no-underline border-b-4 border-blue-900 ${
            remaining_path === 'edit' ? '' : 'border-opacity-0'
          }`}
        >
          Edit
        </Link>
      </div>

      <Router>
        <Track
          path={`${routes.exerciseBase}/:id`}
          todaysHistory={
            exerciseHistory?.items?.[dayjs().format('YYYY-MM-DD')] || []
          }
          exerciseId={id}
          onAddSet={getData}
          lastWorkoutFirstSet={lastWorkoutFirstSet}
        />
        <ExerciseStats
          path={`${routes.exerciseBase}/:id/history`}
          exerciseHistory={exerciseHistory}
          onChangeSet={getData}
        />
        <EditExercise
          path={`${routes.exerciseBase}/:id/edit`}
          exerciseHistory={exerciseHistory}
          onEdit={getData}
        />
      </Router>
    </div>
  )
}

export default Exercise
