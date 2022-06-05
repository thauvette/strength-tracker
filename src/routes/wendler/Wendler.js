import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import { Link } from "preact-router"

import get from "lodash.get"
import Accordion from "../../components/accordion/accordion"
import useDB from "../../context/db"

export default function Wendler({ id }) {
  const { getItemById, updateWendlerItem } = useDB()

  const [workout, setWorkout] = useState(null)

  useEffect(() => {
    getItemById(id).then(res => setWorkout(res))
  }, [getItemById, id])

  if (!workout) {
    return <p>Workout not found</p>
  }

  const toggleDayComplete = ({ weekKey, mainLift }) => {
    const isComplete = get(
      workout,
      ["weeks", weekKey, mainLift, "isComplete"],
      false
    )

    updateWendlerItem({
      id,
      path: ["weeks", weekKey, mainLift, "isComplete"],
      value: !isComplete,
    }).then(res => setWorkout(res))
  }

  return (
    <div class="px-2">
      <p>{workout.title}</p>
      <p>{workout.description}</p>
      <hr />
      {Object.entries(workout?.weeks || {}).map(([num, week]) => {
        const weekIsComplete = Object.values(week).every(day => day.isComplete)
        return (
          <div key={num}>
            <Accordion
              title={`${weekIsComplete ? "✔️ " : ""}Week ${num}`}
              titleClass="font-bold text-xl"
            >
              {Object.entries(week || {}).map(([exercise, sets]) => (
                <div key={exercise} className="px-2">
                  <div className="border-b-2">
                    <Accordion
                      title={`${sets.isComplete ? "✔️ " : ""}${sets?.exercise}`}
                      titleClass="uppercase font-bold text-sm"
                    >
                      <div className="border-b-1 pl-2">
                        <div className="pt-2">
                          <p class="uppercase">Main set: {sets?.exercise}</p>

                          {sets?.main?.length > 0 &&
                            sets.main.map((set, i) => {
                              const { reps, weight, completed } = set

                              return (
                                <div key={i}>
                                  <p>
                                    {completed ? "✔️" : ""} {reps} @ {weight}
                                  </p>
                                </div>
                              )
                            })}
                        </div>
                        <div class="py-4">
                          <p className="uppercase">Aux: {sets.auxName}</p>
                          {sets?.aux?.length > 0 &&
                            sets.aux.map((set, i) => {
                              const { reps, weight, completed } = set

                              return (
                                <div key={i}>
                                  <p>
                                    {completed ? "✔️" : ""} {reps} @ {weight}
                                  </p>
                                </div>
                              )
                            })}
                        </div>
                        {!!sets?.additional?.length && (
                          <div>
                            <p className="uppercase">Additional </p>
                            {sets.additional.map((group, i) => (
                              <div key={group.exercise + i} class="">
                                <p class="capitalize">{group.exercise?.name}</p>
                                {!!group?.sets?.length &&
                                  group.sets.map((groupSet, setIndex) => {
                                    const reps = groupSet.reps || 0
                                    const weight = groupSet.weight || 0

                                    const completed = !!groupSet.completed

                                    return (
                                      <div key={setIndex}>
                                        <p>
                                          {completed ? "✔️" : ""} {reps} @{" "}
                                          {weight}
                                        </p>
                                      </div>
                                    )
                                  })}
                              </div>
                            ))}
                          </div>
                        )}
                        <div class="py-4 ">
                          <div class="pb-4 flex">
                            <Link
                              class="uppercase bg-yellow-100 px-2 py-3 text-base no-underline w-full text-center"
                              href={`/wendler/${id}/${num}/${exercise}`}
                            >
                              Do workout
                            </Link>
                          </div>
                          <div class="pb-4">
                            <button
                              class="uppercase bg-blue-100 px-2 py-3 text-base w-full"
                              onClick={() =>
                                toggleDayComplete({
                                  weekKey: num,
                                  mainLift: exercise,
                                })
                              }
                            >
                              {sets.isComplete
                                ? "Mark day incomplete"
                                : "Mark day complete"}
                            </button>
                          </div>
                          <div class="flex">
                            <Link
                              class="uppercase bg-blue-100 px-2 py-3 text-base no-underline w-full text-center"
                              href={`/exercise/${exercise}`}
                            >
                              View Exercise History
                            </Link>
                          </div>
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
