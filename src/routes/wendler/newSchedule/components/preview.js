import { h } from "preact"
import { useState } from "preact/compat"
import { route } from "preact-router"
import set from "lodash.set"
import cloneDeep from "lodash.clonedeep"
import get from "lodash.get"
import Accordion from "../../../../components/accordion/accordion"
import Modal from "../../../../components/modal/Modal"

import AuxExerciseForm from "./auxExerciseForm"
import useDB from "../../../../context/db"

import { routes } from "../../../../config/routes"

import ReorderForm from "./reorderForm"

export default function Preview({ preview: initialPreviewValues, exercises }) {
  const { createCycle } = useDB()
  const [preview, setPreview] = useState({ ...initialPreviewValues })
  const [viewByLift, setViewByLift] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  const [additionalExercises, setAdditionalExercises] = useState({})
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

  const openAuxExerciseModal = exercise => {
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
    Object.values(week).forEach(data => {
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

    Object.entries(additionalExercises).forEach(([week, lifts]) => {
      Object.entries(lifts).forEach(([liftName, sets]) => {
        if (!mainLifts?.[week]?.[liftName].additional) {
          set(mainLifts, [week, liftName, "additional"], [])
        }
        mainLifts?.[week]?.[liftName].additional?.push(...sets)
      })
    })

    createCycle({
      title: formData?.title || "",
      description: formData?.description || "",
      weeks: mainLifts,
      exerciseFormValues: exercises,
    }).then(() => {
      route(routes.wendlerCycles)
    })
  }

  function handleAddAuxExercise({ exercise, sets, addToAllWeeks }) {
    const { week: targetWeek, mainLift: targetLift } = auxExerciseFormData
    // either all weeks or just one week.
    const weeksToUpdate = addToAllWeeks ? [1, 2, 3] : [targetWeek]
    const currentAdditionalWorkSets = { ...additionalExercises }

    const targetIndex = auxExerciseFormData?.initialValues?.index
    weeksToUpdate.forEach(weekNum => {
      const currentRunningSets =
        preview?.[weekNum]?.[targetLift]?.runningSets || []

      sets.forEach(set =>
        currentRunningSets.push({
          ...set,
          text: `${set.reps} @ ${set.weight}`,
          completed: null,
          exercise: exercise.name,
          primaryId: exercise.id,
          planned: {
            ...set,
          },
        })
      )

      setPreview(
        set(
          { ...preview },
          [weekNum, targetLift, "runningSets"],
          currentRunningSets
        )
      )
      if (!currentAdditionalWorkSets[weekNum]) {
        currentAdditionalWorkSets[weekNum] = {}
      }
      if (!currentAdditionalWorkSets[weekNum][targetLift]) {
        currentAdditionalWorkSets[weekNum][targetLift] = []
      }

      if (targetIndex !== undefined) {
        currentAdditionalWorkSets[weekNum][targetLift][targetIndex] = {
          exercise,
          sets,
        }
      } else {
        currentAdditionalWorkSets[weekNum][targetLift].push({
          exercise,
          sets,
        })
      }
    })

    setAdditionalExercises(currentAdditionalWorkSets)
    setAuxExerciseFormData(null)
    setAuxExerciseModalIsOpen(false)
  }

  const renderDay = ({ sets, title, week, mainLift }) => {
    return (
      <div>
        <ul>
          {sets.map((set, i) => (
            <li key={i} class="py-1 px-2">
              {set.exercise}: {set.text}
            </li>
          ))}
        </ul>
        <div class="pt-6">
          <button
            class="bg-blue-100"
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
                items: sets.map(set => ({
                  ...set,
                  label: `${set.exercise}: ${set.text}`,
                })),
              })
            }
          >
            Edit Sets
          </button>
        </div>
      </div>
    )
  }

  return (
    <div class="px-2">
      <div class="flex justify-between align-center">
        <h2 class="text-lg">Preview</h2>
        <button onClick={() => setViewByLift(!viewByLift)}>
          {viewByLift ? "Sort by week" : "Sort by lift"}
        </button>
      </div>
      {viewByLift
        ? Object.entries(previewByLift).map(([id, weeks]) => (
            <div key={id} class="py-4">
              <h4>{weeks?.[1]?.exercise || ""}</h4>
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
            placeholder="title"
            type="text"
            value={formData.name}
            onInput={handleInput}
          />
          <br />
          <input
            name="description"
            placeholder="description"
            type="text"
            value={formData.description}
            onInput={handleInput}
          />
          <br />
          <button class="primary" onClick={saveToWorkouts}>
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

                weeks.forEach(week => {
                  const currentSets = get(
                    preview,
                    [week, editOrderModalState.mainLift, "runningSets"],
                    []
                  )
                  const newOrderSets = newOrder.map(num => currentSets[num])

                  set(
                    clonedPreview,
                    [week, editOrderModalState.mainLift, "runningSets"],
                    newOrderSets
                  )
                })

                setPreview(clonedPreview)
                closeReorderModal()
              }}
              allowEditAllWeeks={daysHaveSameSets(
                Object.values(preview || {}),
                editOrderModalState.mainLift
              )}
            />
          </>
        ) : null}
      </Modal>
    </div>
  )
}

const daysHaveSameSets = (weeks, targetLift) => {
  const strings = weeks.map(week =>
    week?.[targetLift]?.runningSets?.map(set => set.primaryId)?.join()
  )
  return strings ? strings.every(string => string === strings[0]) : false
}
