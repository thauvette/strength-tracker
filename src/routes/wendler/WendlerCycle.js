import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import { Link } from "preact-router"

import get from "lodash.get"
import Accordion from "../../components/accordion/accordion"
import useDB from "../../context/db"
import WendlerCycleDay from "./WendlerCycleDay"

const isWeekComplete = (week, isLegacyVersion, cycle) =>
  Object.values(week).every(day => {
    const dayIsComplete = day.isComplete
    const runningSets = isLegacyVersion
      ? day.runningSets
      : day.runningSets.map(setKey => get(cycle, `weeks.${setKey}`))

    return dayIsComplete || runningSets.every(set => !!set.completed)
  })

const formatResponse = res => {
  let firstUnfinishedWeek = Object.entries(res?.weeks || {}).find(
    ([weekKey, data]) => {
      return !isWeekComplete(data, !res?.version, res)
    }
  )

  return {
    ...res,
    weekToDo: firstUnfinishedWeek?.[0],
  }
}

export default function WendlerCycle({ id }) {
  const { getItemById, updateWendlerItem } = useDB()
  const [workout, setWorkout] = useState(null)

  useEffect(() => {
    getItemById(id).then(res => setWorkout(formatResponse(res)))
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
    }).then(res => setWorkout(formatResponse(res)))
  }

  const isLegacyVersion = !workout?.version

  const formatRunningSets = sets =>
    isLegacyVersion ? sets : sets.map(setKey => get(workout, `weeks.${setKey}`))

  const isDayComplete = sets =>
    sets.isComplete ||
    formatRunningSets(sets.runningSets).every(set => !!set.completed)

  const getDaysSets = day => {
    if (isLegacyVersion) {
      const mainSets =
        day?.runningSets?.length > 0
          ? day.runningSets.filter(set => set.wendlerGroup === "main")
          : []

      const auxSets =
        day?.runningSets?.length > 0
          ? day.runningSets.filter(set => set.wendlerGroup === "aux")
          : []

      const additionalSets =
        day?.runningSets?.length > 0
          ? day.runningSets.filter(set => set.wendlerGroup === "additional")
          : []
      return {
        mainSets,
        auxSets,
        additionalSets,
      }
    }

    return {
      mainSets: Object.values(day?.main || {}),
      auxSets: Object.values(day?.aux || {}),
      additionalSets: Object.values(day?.additional || {}),
    }
  }

  return (
    <div class="px-2">
      <p>{workout.title}</p>
      <p>{workout.description}</p>
      <hr />

      {Object.entries(workout?.weeks || {}).map(([num, week]) => {
        const weekIsComplete = isWeekComplete(week, isLegacyVersion, workout)

        return (
          <div key={num}>
            <Accordion
              title={`${weekIsComplete ? "✔️ " : ""}Week ${num}`}
              titleClass="font-bold text-xl"
              openByDefault={+workout?.weekToDo === +num}
            >
              {Object.entries(week || {}).map(([exercise, sets]) => {
                const dayIsComplete = isDayComplete(sets)

                const { mainSets, auxSets, additionalSets } = getDaysSets(sets)

                return (
                  <div key={exercise} className="px-2">
                    <div className="border-b-2">
                      <Accordion
                        title={`${dayIsComplete ? "✔️ " : ""}${sets?.exercise}`}
                        titleClass="uppercase font-bold text-sm"
                      >
                        <div className="border-b-1 pl-2">
                          <WendlerCycleDay
                            runningSets={formatRunningSets(sets.runningSets)}
                            mainSets={mainSets}
                            auxSets={auxSets}
                            additionalSets={additionalSets}
                            mainExercise={sets?.exercise}
                            auxName={sets.auxName}
                          />

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
                          </div>
                        </div>
                      </Accordion>
                    </div>
                  </div>
                )
              })}
            </Accordion>
          </div>
        )
      })}
    </div>
  )
}
