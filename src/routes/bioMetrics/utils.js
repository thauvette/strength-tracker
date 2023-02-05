import dayjs from 'dayjs'

export const convertDays = (days, startOf = 'week') => {
  const result =
    days?.reduce((obj, day) => {
      const key = dayjs(day.dayKey).startOf(startOf).format('YYYY-MM-DD')

      const currentDays = obj[key]?.days || []
      currentDays.push(day)
      const currentWeightInCount = obj[key]?.count || 0

      const groupAverage =
        currentDays.reduce((num, { average }) => num + average, 0) /
        currentDays?.length

      return {
        ...obj,
        [key]: {
          key,
          average: groupAverage,
          days: currentDays,
          count: currentWeightInCount + (day?.items?.length || 0),
        },
      }
    }, {}) || {}
  return Object.values(result)
}

export const convertDaysToWeeks = (days) => convertDays(days, 'week')

const chunkWeeks = (days) => {
  const weeks = convertDaysToWeeks(days)
  return weeks?.map((week) => ({
    title: `Week of ${dayjs(week.key).format('MMM DD')}`,
    dateFormat: 'ddd',
    items: week.days.map((day) => ({
      ...day,
      x: dayjs(day.dayKey).toDate().getTime(),
      y: day.average,
    })),
  }))
}
const chunkMonths = (days) => {
  const months = convertDays(days, 'month')
  return months?.map((month) => ({
    title: `${dayjs(month.key).format('MMMM YYYY')}`,
    dateFormat: 'ddd DD',
    items: month.days.map((day) => ({
      ...day,
      x: dayjs(day.dayKey).toDate().getTime(),
      y: day.average,
    })),
  }))
}
export const renderData = ({ days, displayGroup }) => {
  switch (displayGroup) {
    case 'weeks':
      return chunkWeeks(days || [])
    case 'all':
      return [
        {
          title: 'All Time',
          dateFormat: 'MM/YY',
          items: days.map((day) => ({
            ...day,
            x: dayjs(day.dayKey).toDate().getTime(),
            y: day.average,
          })),
        },
      ]
    case 'months':
      return chunkMonths(days)
    default:
      return null
  }
}
