import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { Router, Link } from "preact-router"
import dayjs from "dayjs"
import useDB from "../../context/db"
import ExerciseHistory from "./ExerciseHistory"
import Track from "./Track"
import { routes } from "../../config/routes"

const Exercise = props => {
  const { id, remaining_path } = props
  const { getExerciseHistoryById } = useDB()
  const [exerciseHistory, setExerciseHistory] = useState(null)

  const getData = () =>
    getExerciseHistoryById(id)
      .then(res => {
        let eorm
        const formattedHistory = res?.items?.length
          ? res.items.reduce((obj, item) => {
              const dayKey = dayjs(item.created).format("YYYY-MM-DD")
              const items = obj?.[dayKey] || []
              const estOneRepMax = (
                item.weight * item.reps * 0.033 +
                item.weight
              ).toFixed(2)
              if (!eorm || eorm.max < estOneRepMax) {
                eorm = {
                  time: item.created,
                  day: dayKey,
                  max: estOneRepMax,
                }
              }
              items.push({
                ...item,
                estOneRepMax,
              })
              return {
                ...obj,
                [dayKey]: items,
              }
            }, {})
          : {}

        setExerciseHistory({ ...res, items: formattedHistory, eorm })
      })
      .catch(err => {
        console.log(err)
      })

  useEffect(() => {
    getData()
  }, []) // eslint-disable-line

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
