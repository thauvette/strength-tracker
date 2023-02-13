import { h } from 'preact'
import dayjs from 'dayjs'
import Icon from '../../components/icon/Icon'
import { convertDaysToWeeks } from './utils'

const Weeks = ({ days = [] }) => {
  if (!days?.length) {
    return null
  }
  const weeks = convertDaysToWeeks(days)

  return (
    <div class="py-4">
      <h2>Weeks</h2>
      {weeks.map((week, i) => {
        const previousWeekAverage = Object.values(weeks)?.[i + 1]?.average

        const change = previousWeekAverage
          ? week.average - previousWeekAverage
          : undefined
        return (
          <div key={week.key} className="mb-3">
            <div className="flex items-center justify-between p-2 text-lg font-bold card-header">
              <p>Week of {dayjs(week.key).format('MMM DD YYYY')}</p>
              <p>{week.average.toFixed(2)}</p>
            </div>
            <div className="flex justify between p-2 card-body">
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
