import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { Router, Link, route } from 'preact-router'
import dayjs from 'dayjs'

import useDB from '../context/db/db'
import { objectStores } from '../context/db/config'
import useSessionContext from '../context/sessionData/sessionData'
import useExerciseHistory from '../hooks/useExerciseHistory/useExerciseHistory'

import { routes } from '../config/routes'

import ExerciseStats from '../components/exerciseStats/ExerciseStats'
import Track from '../components/exercise/Track'
import EditExercise from '../components/exercise/EditExercise'
import PlannedSets from '../components/PlannedSets'
import Icon from '../components/icon/Icon'
import LoadingSpinner from '../components/LoadingSpinner'

const Exercise = ({ id, remaining_path }) => {
  const [includeBwInHistory, setIncludeBwInHistory] = useState(false)
  const [exerciseHistory, getData] = useExerciseHistory(id, includeBwInHistory)
  const { updateEntry } = useDB()

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
    return (
      <div class="flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const itemsArrays = Object.values(exerciseHistory?.items || {})
  const lastIndex = Object.values(exerciseHistory?.items || {})?.length
    ? Object.values(exerciseHistory?.items || {})?.length - 1
    : 0

  const lastWorkOutSorted = itemsArrays?.[lastIndex]?.sort((a, b) =>
    a.create < b.create ? -1 : 1,
  )

  const lastWorkoutFirstSet = lastWorkOutSorted?.[0] || null
  const heaviestSet =
    lastWorkOutSorted?.reduce((obj, set) => {
      if (!obj || +obj.weight < +set.weight) {
        return set
      }
      return obj
    }, null) || null

  const toggleExerciseFavorite = () => {
    updateEntry(objectStores.exercises, id, {
      isFavorite: !exerciseHistory?.isFavorite,
    }).finally(() => {
      getData()
    })
  }
  return (
    <div>
      <div class="px-3 py-3 ">
        <div class="flex items-center justify-between">
          <h1 class="capitalize">{exerciseHistory?.name}</h1>

          <button
            onClick={toggleExerciseFavorite}
            class="text-highlight-900 dark:text-highlight-100"
          >
            <Icon
              width="28"
              name={exerciseHistory?.isFavorite ? 'star' : 'star-outline'}
            />
          </button>
        </div>
        {exerciseHistory?.notes && <p>{exerciseHistory.notes}</p>}
      </div>

      <div class="flex pb-4">
        <Link
          href={`${routes.exerciseBase}/${id}`}
          class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${
            !remaining_path ? '' : 'border-opacity-0 dark:border-opacity-0'
          }`}
        >
          Track
        </Link>
        <Link
          href={`${routes.exerciseBase}/${id}/history`}
          class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${
            remaining_path === 'history'
              ? ''
              : 'border-opacity-0 dark:border-opacity-0'
          }`}
        >
          History
        </Link>
        <Link
          href={`${routes.exerciseBase}/${id}/edit`}
          class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${
            remaining_path === 'edit'
              ? ''
              : 'border-opacity-0 dark:border-opacity-0'
          }`}
        >
          Edit
        </Link>
        <Link
          href={`${routes.exerciseBase}/${id}/planned`}
          class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${
            remaining_path === 'planned'
              ? ''
              : 'border-opacity-0 dark:border-opacity-0'
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
          barWeight={exerciseHistory?.barWeight || 45}
        />
        <ExerciseStats
          path={`${routes.exerciseBase}/:id/history`}
          exerciseHistory={exerciseHistory}
          onChangeSet={getData}
          includeBwInHistory={includeBwInHistory}
          setIncludeBwInHistory={setIncludeBwInHistory}
        />
        <EditExercise
          path={`${routes.exerciseBase}/:id/edit`}
          exerciseHistory={exerciseHistory}
          onEdit={getData}
        />
        <PlannedSets
          path={`${routes.exerciseBase}/:id/planned`}
          lastHeavySet={heaviestSet}
          onChangeCompleteSet={getData}
          plannedSet={plannedSet}
          updatePlanedSet={({ id, sets }) => {
            updatePlanedSet({
              id,
              sets: sets?.map((set) => ({
                ...set,
                exerciseName: exerciseHistory?.name,
                barWeight: exerciseHistory.barWeight,
              })),
            })
          }}
        />
      </Router>
    </div>
  )
}

export default Exercise
