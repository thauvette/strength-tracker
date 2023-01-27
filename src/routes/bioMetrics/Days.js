import { h } from 'preact'
import dayjs from 'dayjs'
import Icon from '../../components/icon/Icon'

const Days = ({ days, setEditModalState }) => (
  <div class="py-4">
    <h2 class="mb-2">History</h2>
    {days?.map((day) => {
      const { items, average, change, dayKey } = day
      return (
        <div key={dayKey} className="border mb-3 rounded-sm">
          <div className="flex items-center justify-between bg-primary-100 p-2 text-lg font-bold">
            <p>{dayjs(dayKey).format('ddd MMM DD YYYY')}</p>
            <p>{average.toFixed(2)}</p>
          </div>
          <div className="flex justify between p-2 bg-white">
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
                      <Icon name="create-outline" width="20" />
                    </button>

                    <p className="font-bold mr-2">{item.value}</p>
                    <p>{dayjs(item.date).format('h:mm a')}</p>
                  </div>
                )
              })}
            </div>
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

export default Days
