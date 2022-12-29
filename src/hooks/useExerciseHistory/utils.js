import dayjs from 'dayjs'

export const formatHistory = (items) => {
  let eorm
  const formattedHistory = items?.length
    ? items.reduce((obj, item) => {
        const dayKey = dayjs(item.created).format('YYYY-MM-DD')
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

  const itemsArrays = Object.values(formattedHistory || {})
  const lastIndex = Object.values(formattedHistory || {})?.length
    ? Object.values(formattedHistory || {})?.length - 1
    : 0

  const lastWorkOutSorted = itemsArrays?.[lastIndex]?.sort((a, b) =>
    a.create < b.create ? -1 : 1,
  )

  const lastWorkoutFirstSet = lastWorkOutSorted?.[0] || null
  const heaviestSet = lastWorkOutSorted.reduce((obj, set) => {
    if (!obj || +obj.weight < +set.weight) {
      return set
    }
    return obj
  }, null)

  return {
    items: formattedHistory,
    eorm,
    lastWorkoutFirstSet,
    lastWorkoutHeaviestSet: heaviestSet,
    prs: formatPrs(items),
  }
}

export const formatPrs = (items) => {
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
    const shouldUseLastSet = !!(!actualWeight || lastWeight >= actualWeight)
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
  })
    .reverse()
    .map((set) => {
      const daysHistory = items.filter((item) =>
        dayjs(item.created).isSame(dayjs(set.date), 'day'),
      )
      return {
        ...set,
        daysHistory,
      }
    })
}
