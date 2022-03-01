import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import get from "lodash.get"
import Accordion from "../../components/accordion/accordion"
import useDB from "../../context/db"

import EditableSet from "../../components/editableSet/editableSet"

export default function Workouts({ id }) {
  const { getItemById, updateItem } = useDB()

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

    updateItem({
      id,
      path: ["weeks", weekKey, mainLift, "isComplete"],
      value: !isComplete,
    }).then(res => setWorkout(res))
  }

  const updateSet = ({ weekKey, mainLift, mainOrAux, setIndex, setData }) => {
    updateItem({
      id,
      path: ["weeks", weekKey, mainLift, mainOrAux, setIndex],
      value: setData,
    }).then(res => setWorkout(res))
  }

  const toggleSetComplete = ({
    weekKey,
    mainLift,
    mainOrAux,
    setIndex,
    completed,
  }) => {
    const path = ["weeks", weekKey, mainLift, mainOrAux, setIndex]

    const currentSetData = {
      ...get(workout, path, {}),
      completed: completed ? new Date().getTime() : null,
    }
    // TODO: add the set to logs. -> not set up yet in indexedBd
    updateItem({
      id,
      path,
      value: currentSetData,
    }).then(res => setWorkout(res))
  }

  const updateAdditionalSet = ({
    weekKey,
    mainLift,
    additionalIndex,
    setIndex,
    setData,
  }) => {
    const path = [
      "weeks",
      weekKey,
      mainLift,
      "additional",
      additionalIndex,
      "sets",
      setIndex,
    ]
    updateItem({
      id,
      path,
      value: setData,
    }).then(res => setWorkout(res))
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
                            sets.main.map((set, i) => {
                              const { reps, weight, completed } = set

                              return (
                                <div key={set.text + i} class="border-b">
                                  <EditableSet
                                    onChangeReps={newReps =>
                                      updateSet({
                                        weekKey: num,
                                        mainLift: exercise,
                                        mainOrAux: "main",
                                        setIndex: i,
                                        setData: {
                                          ...set,
                                          reps: newReps,
                                        },
                                      })
                                    }
                                    onChangeWeight={newWeight =>
                                      updateSet({
                                        weekKey: num,
                                        mainLift: exercise,
                                        mainOrAux: "main",
                                        setIndex: i,
                                        setData: {
                                          ...set,
                                          weight: newWeight,
                                        },
                                      })
                                    }
                                    reps={+reps}
                                    weight={+weight}
                                    isComplete={!!completed}
                                    onToggleComplete={checked =>
                                      toggleSetComplete({
                                        weekKey: num,
                                        mainLift: exercise,
                                        mainOrAux: "main",
                                        setIndex: i,
                                        completed: checked,
                                      })
                                    }
                                    title={`${exercise}, set ${i + 1} - ${
                                      set.text
                                    }`}
                                  />
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
                                <div key={set.text + i}>
                                  <EditableSet
                                    onChangeReps={newReps =>
                                      updateSet({
                                        weekKey: num,
                                        mainLift: exercise,
                                        mainOrAux: "aux",
                                        setIndex: i,
                                        setData: {
                                          ...set,
                                          reps: +newReps,
                                        },
                                      })
                                    }
                                    onChangeWeight={newWeight =>
                                      updateSet({
                                        weekKey: num,
                                        mainLift: exercise,
                                        mainOrAux: "aux",
                                        setIndex: i,
                                        setData: {
                                          ...set,
                                          weight: +newWeight,
                                        },
                                      })
                                    }
                                    reps={+reps}
                                    weight={+weight}
                                    isComplete={!!completed}
                                    onToggleComplete={checked =>
                                      toggleSetComplete({
                                        weekKey: num,
                                        mainLift: exercise,
                                        mainOrAux: "aux",
                                        setIndex: i,
                                        completed: checked,
                                      })
                                    }
                                    title={`${sets.auxName}, set ${i + 1} - ${
                                      set.text
                                    }`}
                                  />
                                </div>
                              )
                            })}
                        </div>
                        {!!sets?.additional?.length && (
                          <div>
                            <p className="uppercase">Additional </p>
                            {sets.additional.map((group, i) => (
                              <div key={group.exercise + i} class="">
                                <p class="capitalize">{group.exercise}: </p>
                                {!!group?.sets?.length &&
                                  group.sets.map((groupSet, setIndex) => {
                                    const reps = groupSet.reps || 0
                                    const weight = groupSet.weight || 0

                                    const completed = !!groupSet.completed
                                    return (
                                      <div key={setIndex}>
                                        <EditableSet
                                          onChangeReps={newReps =>
                                            updateAdditionalSet({
                                              weekKey: num,
                                              mainLift: exercise,
                                              additionalIndex: i,
                                              setIndex,
                                              setData: {
                                                ...groupSet,
                                                reps: newReps,
                                              },
                                            })
                                          }
                                          onChangeWeight={newWeight =>
                                            updateAdditionalSet({
                                              weekKey: num,
                                              mainLift: exercise,
                                              additionalIndex: i,
                                              setIndex,
                                              setData: {
                                                ...groupSet,
                                                weight: newWeight,
                                              },
                                            })
                                          }
                                          reps={reps}
                                          weight={weight}
                                          isComplete={completed}
                                          onToggleComplete={checked =>
                                            updateAdditionalSet({
                                              weekKey: num,
                                              mainLift: exercise,
                                              additionalIndex: i,
                                              setIndex,
                                              setData: {
                                                ...groupSet,
                                                completed: checked
                                                  ? new Date().getTime()
                                                  : null,
                                              },
                                            })
                                          }
                                          title={`${group.exercise} set ${
                                            setIndex + 1
                                          }`}
                                        />
                                      </div>
                                    )
                                  })}
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
                              ? "Mark day incomplete"
                              : "Mark day complete"}
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
