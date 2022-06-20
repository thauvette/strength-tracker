import { h } from "preact"
import { Router, Link } from "preact-router"
import dayjs from "dayjs"
import ExerciseHistory from "./ExerciseHistory"
import Track from "./Track"
import { routes } from "../../config/routes"
import useExerciseHistory from "../../hooks/useExerciseHistory"

const Exercise = props => {
  const { id, remaining_path } = props
  const [exerciseHistory, getData] = useExerciseHistory(id)

  if (!exerciseHistory) {
    return null
  }

  return (
    <div>
      <h1 class="capitalize mb-2">{exerciseHistory?.name}</h1>
      <div class="flex pb-4">
        <Link
          href={`${routes.exerciseBase}/${id}`}
          class={`px-4 py-2 bg-blue-100 text-gray-800 no-underline border-b-4 border-blue-900 ${
            !remaining_path ? "" : "border-opacity-0"
          }`}
        >
          Track
        </Link>
        <Link
          href={`${routes.exerciseBase}/${id}/history`}
          class={`px-4 py-2 bg-blue-100  text-gray-800 no-underline border-b-4 border-blue-900 ${
            remaining_path === "history" ? "" : "border-opacity-0"
          }`}
        >
          History
        </Link>
      </div>

      <Router>
        <Track
          path={`${routes.exerciseBase}/:id`}
          todaysHistory={
            exerciseHistory?.items?.[dayjs().format("YYYY-MM-DD")] || []
          }
          exerciseId={id}
          onAddSet={getData}
        />
        <ExerciseHistory
          path={`${routes.exerciseBase}/:id/history`}
          exerciseHistory={exerciseHistory}
        />
      </Router>
    </div>
  )
}

export default Exercise
