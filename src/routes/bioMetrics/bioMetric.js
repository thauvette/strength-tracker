import { h } from 'preact'
import { useState } from 'preact/hooks'
import dayjs from 'dayjs'
import cloneDeep from 'lodash.clonedeep'

import dateFormats from '../../config/dateFormats'
import BioMetricForm from './bioMetricForm'

import Modal from '../../components/modal/Modal'
import Icon from '../../components/icon/Icon'

const BioMetric = ({ id, addEntry, bioMetrics, editEntry, removeEntry }) => {
  const currentBioMetric = bioMetrics[id]

  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    id: null,
  })
  const [editModalState, setEditModalState] = useState({
    isOpen: false,
    item: null,
  })
  const closeEditModal = () => {
    setEditModalState({
      isOpen: false,
      item: null,
    })
  }
  const deleteModalItem = currentBioMetric?.items?.find(
    (item) => item.id === deleteModalState.id,
  )
  const closeDeleteModal = () =>
    setDeleteModalState({
      open: false,
      id: null,
    })

  const handleAddEntry = (data) => {
    addEntry({
      bioMetricId: id,
      data,
    })
  }

  const groupedItems = cloneDeep(currentBioMetric?.items || [])?.reduce(
    (obj, item) => {
      const dayKey = dayjs(item.date).format('YYYY-MM-DD')

      const currentDayItems = obj[dayKey]?.items || []
      currentDayItems.push(item)
      const total = currentDayItems
        .map((item) => +item.value)
        ?.reduce((num, value) => num + value, 0)

      let dayAverage
      try {
        dayAverage = total / currentDayItems.length
      } catch (err) {}
      return {
        ...obj,
        [dayKey]: {
          items: currentDayItems,
          average: dayAverage,
        },
      }
    },
    {},
  )

  const orderedKeys = Object.keys(groupedItems).sort((a, b) =>
    dayjs(a).isBefore(dayjs(b)) ? 1 : -1,
  )

  return (
    <div class="px-2">
      <h1 class="capitalize">{currentBioMetric?.name}</h1>
      <BioMetricForm
        initialValues={{
          value:
            currentBioMetric?.items?.[currentBioMetric?.items.length - 1]
              ?.value || '',
        }}
        submit={(data) => {
          handleAddEntry(data)
        }}
        name={currentBioMetric?.name}
        submitText="Add New +"
      />
      {orderedKeys?.length > 0 && (
        <div class="py-4">
          <h2 class="mb-2">History</h2>

          {orderedKeys?.map((dayKey, i) => {
            const { items, average } = groupedItems[dayKey]
            const previousDayKey = orderedKeys[i + 1]

            const previousData = previousDayKey
              ? groupedItems[previousDayKey]
              : null

            const change = previousData?.average
              ? average - previousData?.average
              : undefined

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
                        <div
                          key={item.id}
                          className="flex items-center mb-2 text-lg"
                        >
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
                              change > 0
                                ? 'arrow-up-outline'
                                : 'arrow-down-outline'
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
      )}
      {deleteModalState.open && (
        <Modal onRequestClose={closeDeleteModal} isOpen={deleteModalState.open}>
          <h1 class="mb-4">Are you sure?</h1>
          <p class="mb-4">Confirm you want to delete this entry</p>
          <p class="mb-4">
            {currentBioMetric?.name}, {deleteModalItem?.value},{' '}
            {dayjs(deleteModalItem.date).format(dateFormats.displayShort)}
          </p>
          <div class="flex">
            <button
              class="btn warning flex-1 mr-1"
              onClick={() => {
                removeEntry(deleteModalState.id)
                closeDeleteModal()
              }}
            >
              Yup, ditch it
            </button>
            <button
              class="btn secondary flex-1 ml-1"
              onClick={closeDeleteModal}
            >
              Nope, keep it.
            </button>
          </div>
        </Modal>
      )}
      {editModalState.isOpen && (
        <Modal isOpen={editModalState.isOpen} onRequestClose={closeEditModal}>
          <div>
            <BioMetricForm
              submit={(data) => {
                editEntry(editModalState.item.id, data)
                closeEditModal()
              }}
              initialValues={{
                value: editModalState.item.value,
                date: dayjs(editModalState.item.date).format(dateFormats.day),
                time: dayjs(editModalState.item.date).format(dateFormats.time),
              }}
              name={currentBioMetric?.name}
              submitText="Update"
              renderCtas={({ submit }) => (
                <div class="flex gap-2 mt-8 pt-8 border-t-2 border-primary-100">
                  <button
                    className="flex-1 bg-primary-900 text-white"
                    onClick={submit}
                  >
                    <div className="flex items-center justify-center">
                      <Icon name="save-outline" />
                      <p class="ml-2">Update</p>
                    </div>
                  </button>
                  <button
                    className="flex-1 bg-red-900 text-white "
                    onClick={(e) => {
                      e.preventDefault()
                      setDeleteModalState({
                        id: editModalState.item.id,
                        open: true,
                      })
                      closeEditModal()
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <Icon name="trash-outline" />
                      <p class="ml-2">Delete</p>
                    </div>
                  </button>
                </div>
              )}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default BioMetric
