import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import get from "lodash.get"
import useDB from "../../context/db"

import Set from "./components/Set"
import ExerciseHistoryModal from "../../components/exerciseHistoryModal/ExerciseHistoryModal"

export default function WendlerWorkout({ id, week, mainLift }) {
  const {
    getItemById,
    updateWendlerItem,
    createOrUpdateLoggedSet,
    deleteLoggedSet,
  } = useDB()
  const [cycle, setCycle] = useState(null)
  const [activeSet, setActiveSet] = useState(0)
  const [exerciseHistoryModalId, setExerciseHistoryModalId] = useState(null)

  useEffect(() => {
    getItemById(id).then(res => {
      setCycle(res)
    })
  }, [getItemById, id])

  const workout = get(cycle, ["weeks", week, mainLift])

  if (!workout) {
    return <p>Workout not found</p>
  }
  const isLegacy = !cycle?.version
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

  const updateRunningSet = async ({ setIndex, setData }) => {
    const setId = await updateSetsDB(setData)
    const data = { ...setData, setId: setId || null }
    if (setId) {
      data.setId = setId
    }
    const path = isLegacy
      ? ["weeks", week, mainLift, "runningSets", setIndex]
      : ["weeks", week, mainLift, setData?.wendlerGroup, setData.wendlerId]
    updateWendlerItem({
      id,
      path,
      value: data,
    }).then(res => {
      setCycle(res)
    })
  }

  const sets = isLegacy
    ? workout?.runningSets
    : workout?.runningSets.map(setKey => get(cycle, `weeks.${setKey}`))

  return (
    <div>
      {sets.map((set, setIndex) => {
        const isActive = activeSet === setIndex
        return (
          <div key={setIndex}>
            <Set
              set={set}
              title={set.exercise}
              isActive={isActive}
              makeActive={() => setActiveSet(setIndex)}
              handleSubmit={newValues => {
                updateRunningSet({
                  setIndex,
                  setData: {
                    ...set,
                    ...newValues,
                    completed: new Date().getTime(),
                  },
                })
                setActiveSet(setIndex + 1)
              }}
              handleUndo={
                set.completed
                  ? () => {
                      updateRunningSet({
                        setIndex,
                        setData: {
                          ...set,
                          completed: null,
                        },
                      })
                    }
                  : null
              }
              handleViewHistory={() => setExerciseHistoryModalId(set.primaryId)}
            />
          </div>
        )
      })}
      {exerciseHistoryModalId && (
        <ExerciseHistoryModal
          exerciseId={exerciseHistoryModalId}
          isOpen={!!exerciseHistoryModalId}
          onRequestClose={() => setExerciseHistoryModalId(null)}
        />
      )}
    </div>
  )
}
