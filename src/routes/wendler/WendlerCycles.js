import { h } from 'preact'
import { Link } from 'preact-router'
import { useState, useEffect } from 'preact/hooks'

import { routes } from '../../config/routes'
import useDB, { objectStores } from '../../context/db'

import Modal from '../../components/modal/Modal'

import formatCycleForDuplication from './formatCycleToDuplicate'

const WendlerCycles = ({ navigateToEdit }) => {
  const { getAllEntries, deleteEntry, createCycle } = useDB()
  const [workouts, setWorkouts] = useState(null)
  const [error, setError] = useState(null)

  const [confirmDeleteModalState, setConfirmDeleteModalState] = useState({
    id: null,
    open: false,
  })

  const [duplicateCycleModalState, setDuplicateCycleModalState] = useState({
    workout: null,
    open: false,
    title: '',
    description: '',
  })

  const getData = () =>
    getAllEntries(objectStores.wendlerCycles)
      .then((res) => {
        setWorkouts(res)
      })
      .catch((err) => {
        setError(err?.message || 'something is wrong')
      })

  useEffect(() => {
    getData()
  }, []) // eslint-disable-line

  const handleOpenDuplicateModal = (cycle) =>
    setDuplicateCycleModalState({
      workout: cycle,
      open: true,
      title: `${cycle?.title} - copy`,
      description: cycle?.description,
    })

  const handleCloseDuplicateModal = () =>
    setDuplicateCycleModalState({
      workout: null,
      open: false,
      title: '',
      description: '',
    })

  const handleDuplicateModalInput = (e) =>
    setDuplicateCycleModalState({
      ...duplicateCycleModalState,
      [e.target.name]: e.target.value,
    })

  const handleDuplicateSubmit = () =>
    createCycle(
      formatCycleForDuplication({
        ...duplicateCycleModalState.workout,
        title: duplicateCycleModalState.title,
        description: duplicateCycleModalState.description,
      }),
    ).then(() => {
      getData()
      handleCloseDuplicateModal()
    })

  const handleOpenConfirmDeleteModal = (id) =>
    setConfirmDeleteModalState({
      id,
      open: true,
    })

  const handleCloseConfirmDeleteModal = () =>
    setConfirmDeleteModalState({
      id: null,
      open: false,
    })

  const handleDelete = () => {
    deleteEntry(objectStores.wendlerCycles, confirmDeleteModalState.id).then(
      (res) => setWorkouts(res),
    )
    handleCloseConfirmDeleteModal()
  }

  return (
    <div class="pb-3 px-2 h-full flex flex-col">
      <div class="pt-6 flex-1">
        {error && <p>{error}</p>}
        <div class="flex justify-between">
          <h3>Wendler Cycles</h3>
          <Link href={routes.wendlerNew}>Create+</Link>
        </div>

        {workouts &&
          Object.keys(workouts)?.length > 0 &&
          Object.entries(workouts)
            .sort(([, a], [, b]) => (a.created > b.created ? -1 : 1))
            .map(([id, data]) => (
              <div
                key={id}
                className="border-b border-gray-400 flex justify-between align-center py-4"
              >
                <Link href={`${routes.wendlerBase}/${id}`}>
                  {data?.title} - {data.description}
                </Link>
                <div class="flex">
                  {data?.version && (
                    <>
                      <button
                        onClick={() =>
                          navigateToEdit({
                            ...data,
                            id,
                          })
                        }
                        ariaLabel="edit"
                        class="text-2xl"
                      >
                        <ion-icon name="create-outline" />
                      </button>
                      <button
                        onClick={() => handleOpenDuplicateModal(data)}
                        ariaLabel="duplicate"
                        class="text-2xl"
                      >
                        <ion-icon name="copy-outline" />
                      </button>
                    </>
                  )}
                  <button
                    class="p-0 leading-none color-red-900 text-2xl"
                    onClick={() => handleOpenConfirmDeleteModal(id)}
                    ariaLabel="delete"
                  >
                    <ion-icon name="trash-outline" />
                  </button>
                </div>
              </div>
            ))}
      </div>
      {confirmDeleteModalState?.open && (
        <Modal
          isOpen={confirmDeleteModalState?.open}
          onRequestClose={handleCloseConfirmDeleteModal}
        >
          <div>
            <h1>Really?</h1>
            <p class="mb-4">Are you sure you want to delete this cycle?</p>
            <div class="flex items-center">
              <button onClick={handleDelete} class="btn warning flex-1 mr-2">
                Yup, ditch it.
              </button>
              <button
                class="btn secondary flex-1 ml-2"
                onClick={handleCloseConfirmDeleteModal}
              >
                Naw, keep it
              </button>
            </div>
          </div>
        </Modal>
      )}
      {duplicateCycleModalState?.open && (
        <Modal
          isOpen={duplicateCycleModalState?.open}
          onRequestClose={handleCloseDuplicateModal}
        >
          <div>
            <h1 class="mb-2">Duplicate</h1>
            <div class="pb-4">
              <label>
                <p>Name</p>
                <input
                  class="w-full"
                  type="text"
                  name="title"
                  placeholder="title"
                  defaultValue={duplicateCycleModalState.title}
                  onInput={handleDuplicateModalInput}
                />
              </label>
            </div>
            <div class="pb-4">
              <label>
                <p>Description</p>
                <input
                  class="w-full"
                  type="text"
                  name="description"
                  placeholder="description"
                  defaultValue={duplicateCycleModalState.description}
                  onInput={handleDuplicateModalInput}
                />
              </label>
            </div>
            <div class="pt-4 flex">
              <div class="flex-1 pr-1">
                <button
                  class="btn secondary w-full"
                  onClick={handleCloseDuplicateModal}
                >
                  Cancel
                </button>
              </div>
              <div class="flex-1 pl-1">
                <button
                  class="btn primary w-full"
                  onClick={handleDuplicateSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default WendlerCycles
