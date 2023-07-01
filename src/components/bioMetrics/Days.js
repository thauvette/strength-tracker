import { h } from 'preact'
import dayjs from 'dayjs'
import Icon from '../../components/icon/Icon'
import BioMetricForm from './bioMetricForm'
import { formatToFixed } from '../../utilities.js/formatNumbers'

const Change = ({ number }) => (
  <div class="min-w-[48px] flex justify-end">
    {number !== undefined && (
      <div class="flex items-center text-sm">
        {number !== 0 && (
          <Icon name={number > 0 ? 'arrow-up-outline' : 'arrow-down-outline'} />
        )}
        <span className="ml-2 text-sm">
          {number === 0 ? '--' : formatToFixed(number)}
        </span>
      </div>
    )}
  </div>
)

const Days = ({
  days,
  setEditModalState,
  initialFormValues,
  handleAddEntry,
  name,
}) => (
  <div class="py-4">
    <BioMetricForm
      initialValues={initialFormValues}
      submit={(data) => {
        handleAddEntry(data)
      }}
      name={name}
      submitText="Add New +"
    />
    <h2 class="mb-2">History</h2>
    {days?.map((day) => {
      const { items, average, change, dayKey } = day
      return (
        <div key={dayKey} className="mb-3">
          <div className="flex items-center justify-between card-header">
            <p>{dayjs(dayKey).format('ddd MMM DD YYYY')}</p>
            <div class="flex items-center gap-2">
              <p>{formatToFixed(average)}</p>

              <Change number={change} />
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
                      <Icon name="create-outline" width="20" />
                    </button>

                    <p>{dayjs(item.date).format('h:mm a')}</p>
                    <div class="ml-auto flex items-center gap-2">
                      <p className="font-bold text-sm mr-1">{item.value}</p>

                      <Change number={item.diff} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    })}
  </div>
)

export default Days
