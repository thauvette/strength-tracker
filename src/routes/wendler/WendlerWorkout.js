import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import get from "lodash.get"
import useDB from "../../context/db"

import Set from "./components/Set"
import ExerciseHistoryModal from "../../components/exerciseHistoryModal/ExerciseHistoryModal"
import useExerciseHistory from "../../hooks/useExerciseHistory/useExerciseHistory"

export default function WendlerWorkout({ id, week, mainLift }) {
  const {
    getItemById,
    updateWendlerItem,
    createOrUpdateLoggedSet,
    deleteLoggedSet,
  } = useDB()
  const [cycle, setCycle] = useState(null)
  const [activeSet, setActiveSet] = useState(0)
  const [exerciseHistoryModalState, setExerciseHistoryModalState] = useState({
    isOpen: false,
    id: null,
  })

  const [exerciseHistory, getData] = useExerciseHistory(
    exerciseHistoryModalState.id
  )

  useEffect(() => {
    getItemById(id).then(res => {
      setCycle(res)
    })
  }, [getItemById, id])

  const workout = get(cycle, ["weeks", week, mainLift])
  const isLegacy = !cycle?.version
  const sets = isLegacy
    ? workout?.runningSets
    : workout?.runningSets.map(setKey => get(cycle, `weeks.${setKey}`))

  useEffect(() => {
    const currentSetId = sets?.[activeSet]?.primaryId
    if (currentSetId && currentSetId !== exerciseHistoryModalState.id) {
      setExerciseHistoryModalState({
        ...exerciseHistoryModalState,
        id: currentSetId,
      })
    }
  }, [sets, activeSet, exerciseHistoryModalState])

  if (!workout) {
    return <p>Workout not found</p>
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
      getData()
    })
  }

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
              handleViewHistory={() =>
                setExerciseHistoryModalState({
                  isOpen: true,
                  id: set.primaryId,
                })
              }
            />
          </div>
        )
      })}
      {exerciseHistoryModalState?.id && (
        <ExerciseHistoryModal
          isOpen={exerciseHistoryModalState.isOpen}
          onRequestClose={() =>
            setExerciseHistoryModalState({
              ...exerciseHistoryModalState,
              isOpen: false,
            })
          }
          onUpdate={getData}
          exerciseHistory={exerciseHistory}
        />
      )}
    </div>
  )
}
