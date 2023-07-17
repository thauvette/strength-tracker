import dayjs from 'dayjs'

const chunkDatesByRange = (days, range = 8, timeSpan = 'weeks') => {
  const { lastEntry, firstEntry } = getRangeDates(days)

  const diff = Math.ceil(
    dayjs(lastEntry).diff(dayjs(firstEntry), timeSpan, true),
  )
  const keys = Array.from({ length: Math.ceil(diff / range) }, (_, i) =>
    dayjs(lastEntry)
      .subtract((i + 1) * range, timeSpan)
      .format('YYYY-MM-DD'),
  )

  return days.reduce((obj, day) => {
    // find the appropriate key

    const key = keys.find((key) => {
      // we are searching from the end back in time
      // the day key is the same or before the key

      // is the same as key
      if (dayjs(day.dayKey).isSame(dayjs(key))) {
        return true
      }
      const dayjsObj = dayjs(day.dayKey)
      return dayjsObj.isAfter(key, 'days')
    })
    const items = obj?.[key]?.data || []
    items.push(day)

    const start =
      !obj?.[key]?.start || day.x < obj?.[key]?.start
        ? day.x
        : obj?.[key]?.start
    const end =
      !obj?.[key]?.end || day.x > obj?.[key]?.end ? day.x : obj?.[key]?.end

    const title = `${dayjs(start).format('MMM DD YYYY')} to ${dayjs(end).format(
      'MMM DD YYYY',
    )}`

    return {
      ...obj,
      [key]: {
        ...(obj?.[key] || {}),
        start,
        end,
        title,
        data: items,
      },
    }
  }, {})
}

export const getAllTimeData = (days) => {
  const { firstEntry, lastEntry } = getRangeDates(days)
  return {
    title: `${dayjs(firstEntry).format('MMM DD YYYY')} to ${dayjs(
      lastEntry,
    ).format('MMM DD YYYY')}`,
    data: days,
  }
}

const getRangeDates = (days) => {
  const dates = days.map((day) => dayjs(day.dayKey).toDate().getTime())
  const lastEntry = Math.max(...dates)
  const firstEntry = Math.min(...dates)
  return {
    firstEntry,
    lastEntry,
  }
}

export default chunkDatesByRange
