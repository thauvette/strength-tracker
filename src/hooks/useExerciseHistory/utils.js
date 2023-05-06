import dayjs from 'dayjs'
import { formatToFixed } from '../../utilities.js/formatNumbers'

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
  const heaviestSet = lastWorkOutSorted?.reduce((obj, set) => {
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

export const formatPrs = (items, includeBwInHistory) => {
  const maxes = items?.length
    ? items.reduce((obj, item) => {
        const weight = includeBwInHistory
          ? formatToFixed(+item.weight + (item.bw || 0))
          : +item.weight

        if (!obj?.[item.reps] || obj[item.reps].weight < weight) {
          obj[item.reps] = { ...item, weight }
        }

        return obj
      }, {})
    : {}

  return Object.values(maxes).map((set) => {
    const daysHistory = items.filter((item) =>
      dayjs(item.created).isSame(dayjs(set.created), 'day'),
    )
    return {
      ...set,
      displayWeight: set.weight,
      date: set.created,
      daysHistory,
    }
  })
}
