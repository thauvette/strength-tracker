import { weeks, bigButBoringSetsByWeek } from "../config/weights"

export default function generateProgram({ exercises, auxVersion }) {
  const lessBoring = auxVersion === "bbslb"
  const auxPairs = auxVersion
    ? {
        deadlift: lessBoring ? "barbell back squat" : "deadlift",
        "barbell bench press": lessBoring
          ? "standing overhead press"
          : "barbell bench press",
        "barbell back squat": lessBoring ? "deadlift" : "barbell back squat",
        "standing overhead press": lessBoring
          ? "barbell bench press"
          : "standing overhead press",
      }
    : null

  return weeks.reduce((obj, week, index) => {
    const objKey = index + 1

    if (!obj[objKey]) {
      obj[objKey] = {}
    }

    Object.entries(exercises).forEach(([id, info]) => {
      if (!obj[objKey][id]) {
        obj[objKey][id] = {
          auxName: auxPairs?.[info.name] || "",
          exercise: info.name,
          primaryId: info.primaryId,
          runningSets: [],
        }
      }

      week.forEach(set => {
        const target = info.weight * set.math
        const rounded = +target.toFixed(0)
        obj[objKey][id].runningSets.push({
          exercise: info.name,
          reps: set.reps,
          weight: rounded,
          completed: null,
          primaryId: info.primaryId,
          wendlerGroup: "main",
        })
      })

      if (auxPairs) {
        // get the id of the aux pair.
        const matchingAuxData = Object.values(exercises).find(
          auxInfo => auxInfo.name === auxPairs[info.name]
        )
        const auxWeight = exercises[matchingAuxData?.primaryId]?.weight

        let j = 0
        while (j < 5) {
          const target = auxWeight * [bigButBoringSetsByWeek[index]]
          const rounded = +target.toFixed(0)
          obj[objKey][id].runningSets.push({
            exercise: matchingAuxData.name,
            reps: 10,
            weight: rounded,
            completed: null,
            primaryId: matchingAuxData.primaryId,
            wendlerGroup: "aux",
          })
          j++
        }
      }
    })

    return obj
  }, {})
}
