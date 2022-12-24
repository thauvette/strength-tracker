import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { Router, Link, route } from 'preact-router'
import dayjs from 'dayjs'
import ExerciseStats from '../../components/exerciseStats/ExerciseStats'
import Track from './Track'
import { routes } from '../../config/routes'
import useExerciseHistory from '../../hooks/useExerciseHistory/useExerciseHistory'
import EditExercise from './EditExercise'
import PlannedSets from './PlannedSets'
import useSessionContext from '../../context/sessionData/sessionData'

const Exercise = (props) => {
  const { id, remaining_path } = props
  const [exerciseHistory, getData] = useExerciseHistory(id)
  // using this to prevent making a change
  // then looking at another tab and losing that change
  const [savedSet, setSavedSet] = useState({
    weight: null,
    reps: null,
  })

  const { updatePlanedSet, getPlannedSets } = useSessionContext()
  const plannedSet = getPlannedSets(id)

  useEffect(() => {
    if (plannedSet) {
      route(`/exercise/${id}/planned`)
    }
  }, []) // eslint-disable-line

  if (!exerciseHistory) {
    return null
  }

  const itemsArrays = Object.values(exerciseHistory?.items || {})
  const lastIndex = Object.values(exerciseHistory?.items || {})?.length
    ? Object.values(exerciseHistory?.items || {})?.length - 1
    : 0

  const lastWorkOutSorted = itemsArrays?.[lastIndex]?.sort((a, b) =>
    a.create < b.create ? -1 : 1,
  )

  const lastWorkoutFirstSet = lastWorkOutSorted?.[0] || null

  const lastSetWeights = lastWorkOutSorted?.map((set) => set.weight)
  const maxWeight = lastSetWeights?.length ? Math.max(...lastSetWeights) : null

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
        <Link
          href={`${routes.exerciseBase}/${id}/planned`}
          class={`px-4 py-2 bg-blue-100  text-gray-800 no-underline border-b-4 border-blue-900 ${
            remaining_path === 'planned' ? '' : 'border-opacity-0'
          }`}
        >
          Plan
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
          exerciseName={exerciseHistory?.name}
          savedSet={savedSet}
          setSavedSet={setSavedSet}
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
        <PlannedSets
          path={`${routes.exerciseBase}/:id/planned`}
          initialWeight={maxWeight || null}
          onChangeCompleteSet={getData}
          plannedSet={plannedSet}
          updatePlanedSet={updatePlanedSet}
        />
      </Router>
    </div>
  )
}

export default Exercise
