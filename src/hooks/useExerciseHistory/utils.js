import dayjs from "dayjs"

export const formatHistory = items => {
  let eorm
  const formattedHistory = items?.length
    ? items.reduce((obj, item) => {
        const dayKey = dayjs(item.created).format("YYYY-MM-DD")
        const items = obj?.[dayKey] || []
        const estOneRepMax = (
          +item.weight * +item.reps * 0.033 +
          +item.weight
        ).toFixed(2)
        if (!eorm || eorm.max < +estOneRepMax) {
          eorm = {
            time: item.created,
            day: dayKey,
            max: +estOneRepMax,
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

  return {
    items: formattedHistory,
    eorm,
  }
}

export const formatPrs = items => {
  const maxes = items?.length
    ? items.reduce((obj, item) => {
        if (!obj?.[item.reps] || obj[item.reps].weight < item.weight) {
          obj[item.reps] = item
        }
        return obj
      }, {})
    : {}

  const mostReps = Math.max(...Object.keys(maxes))
  let lastRepsWithData
  return Array.from({ length: mostReps }, (_, i) => {
    const targetKey = mostReps - i
    const hasActualData = !!maxes[targetKey]

    const actualWeight = maxes[targetKey]?.weight
    const lastWeight = maxes[lastRepsWithData]?.weight

    const shouldUseLastSet = !!(!actualWeight || lastWeight > actualWeight)
    const isActualSet = hasActualData && !shouldUseLastSet
    if (isActualSet) {
      lastRepsWithData = targetKey
    }
    return {
      isActualSet,
      reps: targetKey,
      displayWeight: shouldUseLastSet ? lastWeight : actualWeight,
      actualWeight,
      date: hasActualData
        ? maxes[targetKey]?.created
        : maxes[lastRepsWithData]?.created,
    }
  }).reverse()
}
