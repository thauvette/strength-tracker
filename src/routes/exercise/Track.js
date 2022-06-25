import { h } from "preact"
import { useState } from "preact/hooks"
import useDB, { objectStores } from "../../context/db"
import EditableSet from "../../components/editableSet/editableSet"
import calculateOneRepMax from "../../utilities.js/calculateOneRepMax"
import Modal from "../../components/modal/Modal"

const Track = ({
  todaysHistory,
  exerciseId,
  onAddSet,
  lastWorkoutFirstSet,
}) => {
  const lastSet = todaysHistory?.[todaysHistory?.length - 1]

  const { createOrUpdateLoggedSet, deleteEntry } = useDB()

  const [activeSet, setActiveSet] = useState(null)
  const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false)

  const submitNewSet = async ({ weight, reps }) => {
    await createOrUpdateLoggedSet(null, { weight, reps, exercise: +exerciseId })
    onAddSet()
  }

  const updateExistingSet = async ({ weight, reps }) => {
    await createOrUpdateLoggedSet(activeSet.id, {
      weight,
      reps,
    })
    onAddSet()
    setActiveSet(null)
  }

  const deleteSet = async () => {
    await deleteEntry(objectStores.sets, activeSet.id)
    onAddSet()
    setActiveSet(null)
    setDeleteConfirmIsOpen(false)
  }

  return (
    <div class="relative">
      <div className="border-b-4 pb-4">
        <p>New Set</p>
        <EditableSet
          reps={lastSet?.reps || lastWorkoutFirstSet?.reps || 0}
          weight={lastSet?.weight || lastWorkoutFirstSet?.weight || 0}
          renderCtas={({ weight, reps }) => (
            <div class="px-2">
              <button
                class="bg-blue-900 text-white w-full"
                onClick={() => {
                  submitNewSet({ weight, reps })
                }}
              >
                Save
              </button>
            </div>
          )}
        />
      </div>
      <p>Today</p>
      {!!todaysHistory?.length &&
        todaysHistory.map(item => (
          <div key={item.id} class="px-2">
            <div
              class="flex justify-between py-2 items-center"
              role="button"
              onClick={() => {
                setActiveSet(item?.id === activeSet?.id ? null : item)
              }}
            >
              <p class="font-medium">
                {item.reps} @ {item.weight}
              </p>
              <p>{calculateOneRepMax({ ...item })}</p>
            </div>
            {item.id === activeSet?.id && (
              <div>
                <EditableSet
                  reps={activeSet.reps}
                  weight={activeSet.weight}
                  renderCtas={({ weight, reps }) => (
                    <div class="px-4 ">
                      <button
                        class="bg-gray-400 text-gray-900 w-full mb-4"
                        onClick={() => updateExistingSet({ weight, reps })}
                      >
                        Update
                      </button>
                      <button
                        class="bg-red-900 text-white w-full"
                        onClick={() => setDeleteConfirmIsOpen(true)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        ))}
      {deleteConfirmIsOpen && (
        <Modal
          isOpen={deleteConfirmIsOpen}
          onRequestClose={() => setDeleteConfirmIsOpen(false)}
        >
          <div>
            <h1>Are you sure?</h1>
            <p class="mb-2">This action cannot be undone.</p>
            <div class="flex">
              <button
                class="bg-red-900 text-white w-full mr-2"
                onClick={deleteSet}
              >
                Yup, ditch it.
              </button>
              <button
                class="bg-gray-400 text-gray-900 w-full ml-2"
                onClick={() => setDeleteConfirmIsOpen(false)}
              >
                Nope, keep it.
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Track
