import { h } from "preact"
import { useState } from "preact/hooks"
import dayjs from "dayjs"
import cloneDeep from "lodash.clonedeep"
import AnimateHeight from "react-animate-height"

import dateFormats from "../../config/dateFormats"
import BioMetricForm from "./bioMetricForm"

import Modal from "../../components/modal/Modal"

const BioMetric = ({ id, addEntry, bioMetrics, editEntry, removeEntry }) => {
  const currentBioMetric = bioMetrics[id]

  const [activeBioId, setActiveBioId] = useState(null)
  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    id: null,
  })
  const deleteModalItem = currentBioMetric?.items?.find(
    item => item.id === deleteModalState.id
  )
  const closeDeleteModal = () =>
    setDeleteModalState({
      open: false,
      id: null,
    })
  const handleAddEntry = data => {
    addEntry({
      bioMetricId: id,
      data,
    })
  }

  const sortedItems = cloneDeep(currentBioMetric?.items || []).sort((a, b) =>
    dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1
  )

  return (
    <div class="px-2">
      <h1 class="capitalize">{currentBioMetric?.name}</h1>
      <BioMetricForm
        initialValues={{
          value:
            currentBioMetric?.items?.[currentBioMetric?.items.length - 1]
              ?.value || "",
        }}
        submit={data => {
          handleAddEntry(data)
        }}
        name={currentBioMetric?.name}
        submitText="Add New +"
      />
      {sortedItems?.length > 0 && (
        <div class="py-4">
          <h2 class="mb-2">History</h2>
          {sortedItems.map((item, i) => {
            const diff = sortedItems[i + 1]?.value
              ? +item.value - sortedItems[i + 1]?.value
              : undefined

            return (
              <div key={item.id} class="border-blue-400 border-b-2 py-2">
                <p class="font-bold text-lg">
                  {dayjs(item.date).format(dateFormats.displayShort)}
                </p>

                <div>
                  <div class="grid-cols-2 grid py-2">
                    <p class="capitalize">{currentBioMetric?.name}</p>
                    <p>{item.value}</p>
                  </div>
                  <div class="grid-cols-2 grid py-2">
                    <p>Change</p>
                    <p>
                      {diff !== undefined
                        ? `${diff > 0 ? "+" : ""}${diff.toFixed(2)}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div class="flex justify-end">
                  <button
                    onClick={() =>
                      setActiveBioId(activeBioId === item.id ? null : item.id)
                    }
                    ariaLabel="edit entry"
                    class="text-2xl"
                  >
                    <ion-icon name="create-outline" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModalState({
                        id: item.id,
                        open: true,
                      })
                    }
                    class="text-2xl"
                  >
                    <ion-icon name="trash-outline" />
                  </button>
                </div>
                <AnimateHeight height={activeBioId === item.id ? "auto" : 0}>
                  <BioMetricForm
                    submit={data => {
                      editEntry(item.id, data)
                      setActiveBioId(null)
                    }}
                    initialValues={{
                      value: item.value,
                      date: dayjs(item.date).format(dateFormats.day),
                      time: dayjs(item.date).format(dateFormats.time),
                    }}
                    name={currentBioMetric?.name}
                    submitText="Update"
                  />
                </AnimateHeight>
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
            {currentBioMetric?.name}, {deleteModalItem?.value},{" "}
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
    </div>
  )
}

export default BioMetric
