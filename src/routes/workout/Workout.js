import { h } from "preact"
import { useState } from "preact/hooks"
import get from "lodash.get"
import set from "lodash.set"
import Accordion from "../../components/accordion/accordion"
import { LOCAL_STORAGE_WORKOUT_KEY } from "../../config/constants"
import { getItemById, setItem } from "../../utilities.js/useLocalStorage"

export default function Workouts({ id }) {
  const workouts = getItemById(LOCAL_STORAGE_WORKOUT_KEY)
  const [workout, setWorkout] = useState(workouts?.[id])
  if (!workout) {
    return <p>Workout not found</p>
  }

  const toggleDayComplete = ({ weekKey, mainLift }) => {
    const isComplete = get(
      workout,
      ["weeks", weekKey, mainLift, "isComplete"],
      false
    )

    // local version
    const currentWorkout = { ...workout }
    set(currentWorkout, ["weeks", weekKey, mainLift, "isComplete"], !isComplete)
    setWorkout(currentWorkout)

    // update localStorage
    set(workouts, [id, "weeks", weekKey, mainLift, "isComplete"], !isComplete)
    setItem(LOCAL_STORAGE_WORKOUT_KEY, workouts)
  }

  return (
    <div class="px-4">
      <p>{workout.title}</p>
      <p>{workout.description}</p>
      <hr />
      {Object.entries(workout?.weeks || {}).map(([num, week]) => {
        return (
          <div key={num}>
            <Accordion title={`Week ${num}`} titleClass="font-bold text-xl">
              {Object.entries(week || {}).map(([exercise, sets]) => (
                <div key={exercise} className="px-2">
                  <div className="border-b-2">
                    <Accordion
                      title={`${sets.isComplete ? "✔️ " : ""}${exercise} Day`}
                      titleClass="uppercase font-bold text-lg"
                    >
                      <div className="border-b-1 pl-4">
                        <div className="pt-2">
                          <p class="uppercase">Main set: {exercise}</p>
                          {sets?.main?.length > 0 &&
                            sets.main.map((set, i) => (
                              <div key={set.text + i}>
                                <p>{set.text}</p>
                              </div>
                            ))}
                        </div>
                        <div class="py-4">
                          <p className="uppercase">Aux: {sets.auxName}</p>
                          {sets?.aux?.length > 0 &&
                            sets.aux.map((set, i) => (
                              <p key={set.text + i}>{set.text}</p>
                            ))}
                        </div>
                        {!!sets?.additional?.length && (
                          <div>
                            <p className="uppercase">Additional </p>
                            {sets.additional.map((set, i) => (
                              <div
                                key={set.text + i}
                                class="flex justify-between"
                              >
                                <p class="capitalize">{set.exercise}: </p>
                                <p>{set.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div class="py-4">
                          <button
                            class="uppercase bg-blue-100"
                            onClick={() =>
                              toggleDayComplete({
                                weekKey: num,
                                mainLift: exercise,
                              })
                            }
                          >
                            {sets.isComplete
                              ? "Mark incomplete"
                              : "Mark complete"}
                          </button>
                        </div>
                      </div>
                    </Accordion>
                  </div>
                </div>
              ))}
            </Accordion>
          </div>
        )
      })}
    </div>
  )
}
