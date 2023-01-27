import { h } from 'preact'
import dayjs from 'dayjs'
import Icon from '../../components/icon/Icon'

const Weeks = ({ days = [] }) => {
  if (!days?.length) {
    return null
  }
  const weeks =
    days?.reduce((obj, day) => {
      const weekKey = dayjs(day.dayKey).startOf('week').format('YYYY-MM-DD')

      const currentDays = obj[weekKey]?.days || []
      currentDays.push(day)
      const currentWeightInCount = obj[weekKey]?.count || 0

      const weeklyAverage =
        currentDays.reduce((num, { average }) => num + average, 0) /
        currentDays?.length

      return {
        ...obj,
        [weekKey]: {
          average: weeklyAverage,
          days: currentDays,
          count: currentWeightInCount + (day?.items?.length || 0),
        },
      }
    }, {}) || {}

  return (
    <div class="py-4">
      <h2>Weeks</h2>
      {Object.entries(weeks || {}).map(([weekKey, week], i) => {
        const previousWeekAverage = Object.values(weeks)?.[i + 1]?.average

        const change = previousWeekAverage
          ? week.average - previousWeekAverage
          : undefined
        return (
          <div key={weekKey} className="border mb-3 rounded-sm">
            <div className="flex items-center justify-between bg-primary-100 p-2 text-lg font-bold">
              <p>Week of {dayjs(weekKey).format('MMM DD YYYY')}</p>
              <p>{week.average.toFixed(2)}</p>
            </div>
            <div className="flex justify between p-2 bg-white">
              <p className="flex-1 ">
                {week?.count} {week?.count > 1 ? 'entries' : 'entry'}
              </p>
              {change !== undefined && (
                <div>
                  <div className="flex" items-start>
                    {change !== 0 && (
                      <Icon
                        name={
                          change > 0 ? 'arrow-up-outline' : 'arrow-down-outline'
                        }
                      />
                    )}
                    <p className="ml-2">{change.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Weeks
