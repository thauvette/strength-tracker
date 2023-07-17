import dayjs from 'dayjs'
import chunkDatesByRange, {
  getAllTimeData,
} from '../../utilities.js/chunkDatesByRange'

export const renderChartData = ({
  chartType,
  exerciseHistory,
  timeSpan,
  includeBwInHistory,
}) => {
  // get all the daily data, then chunk
  const daysWithData = Object.entries(exerciseHistory?.items, {}).reduce(
    (obj, [dayKey, items]) => {
      let maxWeight = {},
        vol = {
          value: 0,
        },
        maxSingleSetVol = {},
        maxEORM = {}
      const data = obj?.[dayKey]?.data || []
      items.forEach((item) => {
        if (item.isWarmUp) {
          return
        }

        if (
          !maxEORM.value ||
          (item.estOneRepMax && +item.estOneRepMax > maxEORM.value)
        ) {
          maxEORM = {
            ...item,
            value: +item.estOneRepMax,
          }
        }

        const singleSetVol = includeBwInHistory
          ? (item.weight + (item.bw || 0)) * item.reps
          : item.weight * item.reps

        vol.value += singleSetVol

        if (!maxSingleSetVol.value || singleSetVol > maxSingleSetVol.value) {
          maxSingleSetVol = {
            ...item,
            value: singleSetVol,
          }
        }

        const weight = includeBwInHistory
          ? +item.weight + (item.bw || 0)
          : +item.weight
        if (!maxWeight.value || weight > maxWeight.value) {
          maxWeight = {
            ...item,
            value: weight,
          }
        }

        data.push(item)
      })

      return {
        ...obj,
        [dayKey]: {
          maxWeight,
          vol,
          maxSingleSetVol,
          maxEORM,
          data,
        },
      }
    },
    {},
  )
  // Need to chunk from timeSpan
  const chartData = Object.entries(daysWithData || {}).map(
    ([timeKey, data]) => ({
      date: timeKey,
      ...data,
      dayKey: timeKey,
      x: dayjs(timeKey).toDate().getTime(),
      y: data[chartType]?.value,
    }),
  )
  const [num, time] = timeSpan?.split(' ')

  switch (timeSpan) {
    case 'all':
      return [getAllTimeData(chartData)]
    default:
      return Object.values(chunkDatesByRange(chartData, +num, time))?.reverse()
  }
}
