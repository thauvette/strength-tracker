import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import get from "lodash.get"
import useDB, { objectStores } from "../../context/db"
import EditableSet from "../../components/editableSet/editableSet"
import ExerciseHistoryModal from "../../components/exerciseHistoryModal"

const liftGroups = ["main", "aux", "additional", "free"]

export default function WendlerWorkout({ id, week, mainLift }) {
  const {
    getItemById,
    updateWendlerItem,
    createOrUpdateLoggedSet,
    deleteLoggedSet,
  } = useDB()
  const [workout, setWorkout] = useState(null)
  const [activeLiftGroup, setActiveLiftGroup] = useState(0)
  const [activeSet, setActiveSet] = useState(0)
  const [activeAdditionalGroup, setActiveAdditionalGroup] = useState(0)

  useEffect(() => {
    getItemById(id).then(res => {
      const data = get(res, ["weeks", week, mainLift], null)
      setWorkout(data)
    })
  }, [getItemById, id, week, mainLift])

  if (!workout) {
    return <p>Workout not found</p>
  }

  const goToNextSet = () => {
    let dayIsComplete = false
    const currentGroupLength = get(
      workout,
      [liftGroups[activeLiftGroup]],
      []
    ).length

    // additional sets are slightly different
    if (liftGroups[activeLiftGroup] === "additional") {
      const additionalGroup = workout?.additional?.[activeAdditionalGroup]

      if (additionalGroup.sets.length > activeSet + 1) {
        return setActiveSet(activeSet + 1)
      }
      if (workout?.additional?.length > activeAdditionalGroup + 1) {
        setActiveAdditionalGroup(activeAdditionalGroup + 1)
        setActiveSet(0)
        return
      }
      setActiveAdditionalGroup(0)
      setActiveSet(0)
      setActiveLiftGroup(3)
      dayIsComplete = true
    } else {
      if (currentGroupLength > activeSet + 1) {
        return setActiveSet(activeSet + 1)
      }

      let nextIndex = activeLiftGroup + 1

      while (nextIndex <= 2) {
        const nextKey = liftGroups[nextIndex]
        // check if we have something in the schedule
        if (workout?.[nextKey]?.length) {
          break
        }
        nextIndex += 1
      }
      setActiveLiftGroup(nextIndex)
      setActiveSet(0)
      dayIsComplete = nextIndex + 1 === liftGroups?.length
    }

    if (dayIsComplete) {
      updateWendlerItem({
        id,
        path: ["weeks", week, mainLift, "isComplete"],
        value: true,
      })
    }
  }

  const updateSetsDB = async setData => {
    let setId
    if (!setData?.completed && setData?.setId) {
      try {
        await deleteLoggedSet(setData?.setId)
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        const res = await createOrUpdateLoggedSet(setData.setId, {
          reps: setData.reps,
          weight: setData.weight,
          exercise: setData.primaryId,
        })
        setId = res?.id
      } catch (err) {
        console.log(err)
      }
    }
    return setId
  }

  const updateSet = async ({ exerciseKey, setIndex, setData }) => {
    const setId = await updateSetsDB(setData)
    const data = { ...setData, setId: setId || null }
    if (setId) {
      data.setId = setId
    }
    updateWendlerItem({
      id,
      path: ["weeks", week, mainLift, exerciseKey, setIndex],
      value: data,
    }).then(res => {
      setWorkout(get(res, ["weeks", week, mainLift], null))
    })
  }

  const updateAdditionalSet = async ({ groupIndex, setIndex, setData }) => {
    const setId = await updateSetsDB(setData)
    const data = { ...setData, setId: setId || null }
    if (setId) {
      data.setId = setId
    }

    updateWendlerItem({
      id,
      path: [
        "weeks",
        week,
        mainLift,
        "additional",
        groupIndex,
        "sets",
        setIndex,
      ],
      value: data,
    }).then(res => {
      setWorkout(get(res, ["weeks", week, mainLift], null))
    })
  }

  const renderSet = ({
    set,
    i,
    exerciseKey,
    isActiveGroup,
    title,
    groupIndex,
  }) => {
    const { reps, weight, completed } = set
    return (
      <div key={i} class="border-b py-4">
        {isActiveGroup && activeSet === i ? (
          <div>
            <EditableSet
              reps={reps}
              weight={weight}
              isComplete={!!completed}
              onChangeReps={newReps => {
                updateSet({
                  exerciseKey,
                  setIndex: i,
                  setData: {
                    ...set,
                    reps: +newReps,
                  },
                })
              }}
              onChangeWeight={newWeight => {
                updateSet({
                  exerciseKey,
                  setIndex: i,
                  setData: {
                    ...set,
                    weight: +newWeight,
                  },
                })
              }}
              title={`${completed ? "✔️" : ""} Set ${i + 1}`}
            />
            <div class="flex py-4 px-2">
              <button
                class="w-1/2 bg-gray-400 text-gray-900"
                onClick={() => {
                  updateSet({
                    exerciseKey,
                    setIndex: i,
                    setData: {
                      ...set,
                      completed: null,
                    },
                  })
                }}
              >
                Undo
              </button>
              <button
                class="w-1/2 bg-blue-900 text-white text-bold px-4 py-2 ml-2"
                onClick={() => {
                  updateSet({
                    exerciseKey,
                    setIndex: i,
                    setData: {
                      ...set,
                      completed: new Date().getTime(),
                    },
                  })
                  goToNextSet()
                }}
              >
                {completed ? "Update" : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setActiveLiftGroup(groupIndex)
              setActiveSet(i)
            }}
          >
            <p class="capitalize">
              {completed && "✔️"}
              {title} Set {i + 1}
            </p>
            {set.reps} @ {set.weight}
          </button>
        )}
      </div>
    )
  }

  return (
    <div class="">
      {!!workout?.main?.length && (
        <div>
          {workout?.main?.[0]?.exercise && (
            <div class="flex align-center justify-between sticky top-0 bg-primary-50 px-4 py-2 border-b-4">
              <p class="font-bold uppercase text-lg">
                {workout?.main?.[0]?.exercise}
              </p>
              {workout?.main?.[0]?.primaryId && (
                <ExerciseHistoryModal id={workout?.main?.[0]?.primaryId} />
              )}
            </div>
          )}
          {workout.main.map((set, i) =>
            renderSet({
              set,
              i,
              exerciseKey: "main",
              isActiveGroup: activeLiftGroup === 0,
              title: workout?.exercise,
              groupIndex: 0,
            })
          )}
        </div>
      )}
      {!!workout?.aux?.length && (
        <div>
          <div class="flex align-center justify-between sticky top-0 bg-primary-50 px-4 py-2 border-b-4">
            <p class="font-bold uppercase text-lg">{workout.auxName}</p>
            {workout.aux?.[0]?.primaryId && (
              <ExerciseHistoryModal id={workout.aux?.[0]?.primaryId} />
            )}
          </div>
          {workout.aux.map((set, i) =>
            renderSet({
              set,
              i,
              exerciseKey: "aux",
              isActiveGroup: activeLiftGroup === 1,
              title: workout.auxName,
              groupIndex: 1,
            })
          )}
        </div>
      )}
      {!!workout?.additional?.length && (
        <div>
          <p class="font-bold uppercase text-lg">Get after it</p>
          {workout?.additional.map((additionalGroup, groupIndex) => {
            const isActiveAdditionalGroup =
              liftGroups[activeLiftGroup] === "additional" &&
              activeAdditionalGroup === groupIndex

            return (
              <div key={groupIndex}>
                <div class="flex align-center justify-between sticky top-0 bg-primary-50 px-4 py-2 border-b-4">
                  <p class="font-bold uppercase text-lg">
                    {additionalGroup.exercise?.name}
                  </p>
                  {additionalGroup?.exercise?.id && (
                    <ExerciseHistoryModal id={additionalGroup?.exercise?.id} />
                  )}
                </div>
                {!!additionalGroup?.sets?.length &&
                  additionalGroup.sets.map((set, setIndex) => {
                    const primaryId = additionalGroup.exercise?.id
                    const { weight, reps, completed } = set
                    const isActive =
                      isActiveAdditionalGroup && setIndex === activeSet
                    return isActive ? (
                      <div key={setIndex} class="border-b">
                        <p>
                          {completed ? "✔️" : ""}set {setIndex + 1}
                        </p>
                        <EditableSet
                          reps={reps}
                          weight={weight}
                          isComplete={!!completed}
                          onChangeReps={newReps => {
                            updateAdditionalSet({
                              groupIndex,
                              setIndex,
                              setData: {
                                ...set,
                                primaryId,
                                reps: newReps,
                              },
                            })
                          }}
                          onChangeWeight={newWeight => {
                            updateAdditionalSet({
                              groupIndex,
                              setIndex,
                              setData: {
                                ...set,
                                primaryId,
                                weight: newWeight,
                              },
                            })
                          }}
                          title={`${completed ? "✔️" : ""} set ${setIndex + 1}`}
                        />
                        <div>
                          <button
                            class="w-full bg-blue-900 text-white"
                            onClick={() => {
                              updateAdditionalSet({
                                groupIndex,
                                setIndex,
                                setData: {
                                  ...set,
                                  primaryId,
                                  completed: new Date().getTime(),
                                },
                              })
                              goToNextSet()
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={setIndex} class="border-b">
                        <button
                          onClick={() => {
                            setActiveLiftGroup(2)
                            setActiveAdditionalGroup(groupIndex)
                            setActiveSet(setIndex)
                          }}
                        >
                          <p>
                            {completed && "✔️"}
                            Set {setIndex + 1}
                          </p>
                          {set.reps} @ {set.weight}
                        </button>
                      </div>
                    )
                  })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
