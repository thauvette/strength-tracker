import { useRef } from 'preact/hooks'
import dayjs from 'dayjs'
import useIntersectObserver from '../../hooks/useIntersectObserver'
import { formatToFixed } from '../../utilities.js/formatNumbers'
import Icon from '../icon/Icon'
import ChangeIndicator from './ChangeIndicator'

const Day = ({ day, setEditModalState }) => {
  const ref = useRef(null)
  const isIntersecting = useIntersectObserver({
    ref,
  })

  const { items, average, change, dayKey } = day
  return (
    <div ref={ref} className="mb-3">
      <div className="flex items-center justify-between card-header">
        <p>{dayjs(dayKey).format('ddd MMM DD YYYY')}</p>
        <div class="flex items-center gap-2">
          <p>{formatToFixed(average)}</p>

          <ChangeIndicator number={change} />
        </div>
      </div>
      <div className="flex justify between p-2 card-body">
        <div className="flex-1 ">
          {items.map((item) => {
            return (
              <div key={item.id} className="flex items-center mb-2 text-lg">
                <button
                  onClick={() =>
                    setEditModalState({
                      isOpen: true,
                      item,
                    })
                  }
                  ariaLabel="edit entry"
                >
                  {isIntersecting && <Icon name="create-outline" width="20" />}
                </button>

                <p>{dayjs(item.date).format('h:mm a')}</p>
                <div class="ml-auto flex items-center gap-2">
                  <p className="font-bold text-sm mr-1">{item.value}</p>
                  {isIntersecting && <ChangeIndicator number={item.diff} />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Day
