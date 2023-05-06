import dayjs from 'dayjs'

const renderVolumeData = (exerciseHistory, includeBwInHistory = false) => {
  return Object.entries(exerciseHistory?.items || {}).map(([dayKey, items]) => {
    return {
      x: dayjs(dayKey).toDate().getTime(),
      y: items
        .filter((item) => !item.isWarmUp)
        .reduce((num, item) => {
          const weight = includeBwInHistory
            ? item.weight + (item.bw || 0)
            : item.weight

          return num + weight * item.reps
        }, 0),
      data: items,
    }
  })
}

const sortByTimeSpan = (data, timeSpan) => {
  if (!data?.length) {
    return []
  }

  return Object.values(
    data.reduce((obj, item) => {
      const key = dayjs(item.x).startOf(timeSpan).format('YYYY-MM-DD')
      const currentItems = obj[key]?.data || []
      currentItems.push(item)
      return {
        ...obj,
        [key]: {
          key,
          title: dayjs(key).format('MMM YYYY'),
          data: currentItems,
        },
      }
    }, {}),
  ).sort((a, b) => (dayjs(a.key).isBefore(dayjs(b.key)) ? 1 : -1))
}

const chunkData = ({ data, timeSpan }) => {
  switch (timeSpan) {
    case 'month':
      return sortByTimeSpan(data, timeSpan)
    case 'all':
    default:
      return [
        {
          title: 'All Time',
          dateFormat: 'MM/YY',
          data,
        },
      ]
  }
}

export const renderData = ({
  chartType,
  exerciseHistory,
  timeSpan,
  includeBwInHistory,
}) => {
  switch (chartType) {
    case 'vol':
      return chunkData({
        data: renderVolumeData(exerciseHistory, includeBwInHistory),
        timeSpan,
      })
    default:
      return []
  }
}
