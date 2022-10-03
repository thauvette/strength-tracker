import { h } from 'preact'
import { useRef } from 'preact/hooks'
import dayjs from 'dayjs'
import useIntersectObserver from '../../hooks/useIntersectObserver'
import SetRow from '../setRow/setRow'

const ExerciseHistoryDay = ({ items, dayKey, onChangeSet, ormTime }) => {
  const ref = useRef(null)
  const isIntersecting = useIntersectObserver({
    ref,
  })
  return (
    <div ref={ref}>
      <div class="pb-4">
        <div class="border-b-2 pb-1 ">
          <p class="font-medium">{dayjs(dayKey).format('MMM DD, YYYY')}</p>
        </div>

        <div class="py-2">
          {items.map((item) => (
            <div key={item.created}>
              <div
                class={`
                        ${ormTime === item.created ? 'bg-blue-200' : ''}
                        `}
              >
                <SetRow
                  set={item}
                  onChangeSet={onChangeSet}
                  isIntersecting={isIntersecting}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExerciseHistoryDay
