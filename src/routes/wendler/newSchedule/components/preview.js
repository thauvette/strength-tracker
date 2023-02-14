import { h } from 'preact'
import { useState } from 'preact/compat'
import { route } from 'preact-router'
import set from 'lodash.set'
import cloneDeep from 'lodash.clonedeep'
import get from 'lodash.get'
import Accordion from '../../../../components/accordion/accordion'
import Modal from '../../../../components/modal/Modal'

import AuxExerciseForm from './auxExerciseForm'
import useDB from '../../../../context/db/db'

import { routes } from '../../../../config/routes'

import ReorderForm from './reorderForm'
import generateRandomId from '../../../../utilities.js/generateRandomId'

export default function Preview({ initialValues }) {
  const { createCycle } = useDB()
  const [preview, setPreview] = useState({ ...(initialValues?.preview || {}) })
  const [viewByLift, setViewByLift] = useState(false)
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [auxExerciseModalIsOpen, setAuxExerciseModalIsOpen] = useState(false)
  const [auxExerciseFormData, setAuxExerciseFormData] = useState(null)

  const [editOrderModalState, setEditOrderModalState] = useState({
    isOpen: false,
    targetWeek: null,
    mainLift: null,
  })

  if (!preview || !Object.keys(preview).length) {
    return null
  }

  const openAuxExerciseModal = (exercise) => {
    setAuxExerciseFormData(exercise)
    setAuxExerciseModalIsOpen(true)
  }

  const closeAuxExerciseModal = () => {
    setAuxExerciseFormData(null)
    setAuxExerciseModalIsOpen(false)
  }

  const openReorderModal = ({ targetWeek, mainLift, items }) => {
    setEditOrderModalState({
      isOpen: true,
      targetWeek,
      mainLift,
      items,
    })
  }

  const closeReorderModal = () => {
    setEditOrderModalState({
      isOpen: false,
      targetWeek: null,
      mainLift: null,
    })
  }

  const previewByLift = Object.entries(preview).reduce((obj, [key, week]) => {
    Object.values(week).forEach((data) => {
      if (!obj[data.primaryId]) {
        obj[data.primaryId] = {}
      }
      obj[data.primaryId][key] = data
    })
    return obj
  }, {})

  function handleInput(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  function saveToWorkouts() {
    const mainLifts = cloneDeep(preview)
    createCycle({
      title: formData?.title || '',
      description: formData?.description || '',
      weeks: mainLifts,
      exerciseFormValues: initialValues?.exercises || {},
      auxVersion: initialValues?.auxVersion,
      id: initialValues?.id || null,
      created: initialValues.created,
      version: 2,
    }).then(() => {
      route(routes.wendlerCycles)
    })
  }

  function handleAddAuxExercise({ exercise, sets, addToAllWeeks }) {
    const { week: targetWeek, mainLift: targetLift } = auxExerciseFormData
    // either all weeks or just one week.
    const weeksToUpdate = addToAllWeeks ? [1, 2, 3] : [targetWeek]
    weeksToUpdate.forEach((weekNum) => {
      const currentRunningSets =
        preview?.[weekNum]?.[targetLift]?.runningSets || []
      const currentAdditionalSets =
        preview?.[weekNum]?.[targetLift]?.additional || {}

      sets.forEach((set) => {
        const wendlerId = generateRandomId()
        const pathKey = `${weekNum}.${targetLift}.additional.${wendlerId}`
        currentRunningSets.push(pathKey)
        currentAdditionalSets[wendlerId] = {
          ...set,
          completed: null,
          exercise: exercise.name,
          primaryId: exercise.id,
          wendlerGroup: 'additional',
          wendlerId,
        }
      })

      setPreview(
        set(
          { ...preview },
          [weekNum, targetLift, 'runningSets'],
          currentRunningSets,
        ),
      )
    })

    setAuxExerciseFormData(null)
    setAuxExerciseModalIsOpen(false)
  }

  const renderDay = ({ sets, title, week, mainLift }) => (
    <div>
      <ul>
        {sets.map((setPath, i) => {
          const set = get(preview, setPath)
          return (
            <li key={i} class="py-1 px-2">
              {set.exercise}: {set.reps} @ {set.weight}
            </li>
          )
        })}
      </ul>
      <div class="pt-6">
        <button
          class="secondary"
          onClick={() =>
            openAuxExerciseModal({
              title,
              week,
              mainLift,
            })
          }
        >
          Add Aux Sets
        </button>
        <button
          onClick={() =>
            openReorderModal({
              targetWeek: week,
              mainLift,
              items: sets.map((setPath) => {
                const set = get(preview, setPath)
                return {
                  ...set,
                  label: `${set.exercise}: ${set.reps} @ ${set.weight}`,
                }
              }),
            })
          }
        >
          Edit Sets
        </button>
      </div>
    </div>
  )

  return (
    <div class="px-2">
      <div class="flex justify-between align-center">
        <h2 class="text-lg">Preview</h2>
        <button onClick={() => setViewByLift(!viewByLift)}>
          {viewByLift ? 'Sort by week' : 'Sort by lift'}
        </button>
      </div>
      {viewByLift
        ? Object.entries(previewByLift).map(([id, weeks]) => (
            <div key={id} class="py-4">
              <h4>{weeks?.[1]?.exercise || ''}</h4>
              <div class="divide-y">
                {Object.entries(weeks).map(([key, sets]) => (
                  <div key={key} class="py-2 ">
                    <Accordion
                      title={`Week ${key}`}
                      openByDefault
                      titleClass="text-xl font-bold capitalize"
                    >
                      <div>
                        {renderDay({
                          sets: sets.runningSets,
                          title: weeks?.[1]?.exercise,
                          week: key,
                          mainLift: id,
                        })}
                      </div>
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          ))
        : Object.entries(preview).map(([key, week]) => {
            return (
              <div key={key} class="">
                <div>
                  <h4>Week {key}</h4>
                  <div class="divide-y">
                    {Object.entries(week).map(([name, sets]) => {
                      return (
                        <div key={name}>
                          <Accordion
                            title={`${sets.exercise} day`}
                            openByDefault
                            titleClass="text-xl font-bold capitalize"
                          >
                            <div class="pb-10">
                              {renderDay({
                                sets: sets.runningSets,
                                title: sets.exercise,
                                week: key,
                                mainLift: name,
                              })}
                            </div>
                          </Accordion>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
      <div class="py-4 fixed bottom-0 right-8">
        <button class="primary" onClick={() => setModalIsOpen(true)}>
          Save
        </button>
      </div>

      <Modal
        isOpen={auxExerciseModalIsOpen}
        onRequestClose={closeAuxExerciseModal}
      >
        <div>
          <AuxExerciseForm
            handleSubmit={handleAddAuxExercise}
            mainLift={auxExerciseFormData?.mainLift}
            title={auxExerciseFormData?.title}
            week={auxExerciseFormData?.week}
            initialValues={auxExerciseFormData?.initialValues || {}}
            onCancel={closeAuxExerciseModal}
          />
        </div>
      </Modal>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div>
          <h1 class="text-lg my-4">Save to my workouts</h1>
          <input
            name="title"
            class="w-full mb-4"
            placeholder="title"
            type="text"
            value={formData.title}
            onInput={handleInput}
          />
          <br />
          <input
            name="description"
            class="w-full mb-4"
            placeholder="description"
            type="text"
            value={formData.description}
            onInput={handleInput}
          />
          <br />
          <button class="primary w-full" onClick={saveToWorkouts}>
            Save
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={editOrderModalState.isOpen}
        onRequestClose={closeReorderModal}
      >
        {editOrderModalState.isOpen ? (
          <>
            <div class="flex justify-end">
              <button onClick={closeReorderModal}>Close x</button>
            </div>
            <ReorderForm
              items={editOrderModalState.items}
              onSave={({ newOrder, updateAllWeeks }) => {
                if (!newOrder) {
                  return closeReorderModal()
                }

                const weeks = updateAllWeeks
                  ? [1, 2, 3]
                  : [editOrderModalState.targetWeek]
                const clonedPreview = cloneDeep(preview)

                weeks.forEach((week) => {
                  const currentSets = get(
                    preview,
                    [week, editOrderModalState.mainLift, 'runningSets'],
                    [],
                  )
                  const newOrderSets = newOrder.map((num) => currentSets[num])

                  set(
                    clonedPreview,
                    [week, editOrderModalState.mainLift, 'runningSets'],
                    newOrderSets,
                  )
                })

                setPreview(clonedPreview)
                closeReorderModal()
              }}
              allowEditAllWeeks={daysHaveSameSets(
                Object.values(preview || {}),
                editOrderModalState.mainLift,
              )}
            />
          </>
        ) : null}
      </Modal>
    </div>
  )
}

const daysHaveSameSets = (weeks, targetLift) => {
  const strings = weeks.map((week) =>
    week?.[targetLift]?.runningSets?.map((set) => set.primaryId)?.join(),
  )
  return strings ? strings.every((string) => string === strings[0]) : false
}
