import { weeks, firstSetLastWeeksMath } from "../config/weights"

export default function generateProgram({ maxes, lessBoring }) {
  const auxPairs = {
    deadlift: lessBoring ? "squat" : "deadlift",
    bench: lessBoring ? "ohp" : "bench",
    squat: lessBoring ? "deadlift" : "squat",
    ohp: lessBoring ? "bench" : "ohp",
  }
  return weeks.reduce((obj, week, index) => {
    const objKey = index + 1

    if (!obj[objKey]) {
      obj[objKey] = {}
    }

    Object.entries(maxes).forEach(([name, weight]) => {
      if (!obj[objKey][name]) {
        obj[objKey][name] = {
          main: [],
          auxName: auxPairs[name],
          aux: [],
        }
      }

      week.forEach(set => {
        const target = weight * set.math
        const rounded = +target.toFixed(0)
        obj[objKey][name].main.push({
          planned: {
            weight: target,
            reps: set.reps,
          },
          exercise: name,
          reps: set.reps,
          weight: rounded,
          text: `${set.repText || set.reps} @ ${rounded}`,
          completed: null,
        })
      })
      const auxWeight = maxes[auxPairs[name]]
      let j = 0
      while (j < 5) {
        const target = auxWeight * [firstSetLastWeeksMath[index]]
        const rounded = +target.toFixed(0)
        obj[objKey][name].aux.push({
          planned: {
            weight: target,
            reps: 5,
          },
          exercise: auxPairs[name],
          reps: 5,
          weight: rounded,
          text: `5 @ ${rounded}`,
          completed: null,
        })
        j++
      }
    })

    return obj
  }, {})
}
