import { h } from "preact"
import { useState } from "preact/compat"
import { route } from "preact-router"
import set from "lodash.set"

import Accordion from "../../../../components/accordion/accordion"
import Modal from "../../../../components/modal/Modal"

import AuxExerciseForm from "./auxExerciseForm"
import useDB from "../../../../context/db"

import { routes } from "../../../../config/routes"

export default function Preview({ preview, exercises }) {
  const { createCycle } = useDB()

  const [viewByLift, setViewByLift] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  const [additionalExercises, setAdditionalExercises] = useState({})
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [auxExerciseModalIsOpen, setAuxExerciseModalIsOpen] = useState(false)
  const [auxExerciseFormData, setAuxExerciseFormData] = useState(null)

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
    const mainLifts = { ...preview }

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

  return (
    <div>
      <div class="flex justify-between align-center">
        <h2 class="text-lg">Preview</h2>
        <button onClick={() => setViewByLift(!viewByLift)}>
          {viewByLift ? "Sort by week" : "Sort by lift"}
        </button>
      </div>
      {/* TODO: needs aux form */}
      {viewByLift
        ? Object.entries(previewByLift).map(([id, weeks]) => (
            <div key={id} class="py-4">
              <h4>{weeks?.[1]?.exercise || ""}</h4>
              <div class="divide-y">
                {Object.entries(weeks).map(([key, sets]) => (
                  <div key={key} class="py-2 ">
                    <Accordion title={`Week ${key}`} openByDefault>
                      <div>
                        <p>{weeks?.[1]?.exercise}</p>
                        {sets.main.map(set => (
                          <p key={set.text}>{set.text}</p>
                        ))}
                        {!!sets?.aux?.length && (
                          <div>
                            <p>Aux: {sets.auxName}</p>
                            {sets.aux.map((set, i) => (
                              <p key={set.text + i}>{set.text}</p>
                            ))}
                          </div>
                        )}
                        <div>
                          {additionalExercises?.[key]?.[id]?.length > 0 && (
                            <div>
                              <p>Aux Work: </p>
                              {additionalExercises?.[key]?.[id]?.map(
                                (additionalSets, index) => (
                                  <div key={index} class="flex items-center">
                                    <p class="m-0">
                                      {additionalSets.sets?.length} sets of{" "}
                                      {additionalSets.exercise?.name}
                                    </p>
                                    <button
                                      onClick={() =>
                                        openAuxExerciseModal({
                                          week: key,
                                          mainLift: id,
                                          title: weeks?.[1]?.exercise,
                                          initialValues: {
                                            ...additionalSets,
                                            index,
                                          },
                                        })
                                      }
                                    >
                                      Edit Sets
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                          <div class="pt-6">
                            <button
                              class="bg-blue-100"
                              onClick={() =>
                                openAuxExerciseModal({
                                  title: weeks?.[1]?.exercise,
                                  week: key,
                                  mainLift: id,
                                })
                              }
                            >
                              Add Aux Sets
                            </button>
                          </div>
                        </div>
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
                          >
                            <div class="pb-10">
                              <p>{sets.exercise}</p>
                              {sets.main.map(set => (
                                <p key={set.text}>{set.text}</p>
                              ))}
                              {sets.auxName}
                              {sets.aux.map((set, i) => (
                                <p key={set.text + i}>{set.text}</p>
                              ))}
                              {additionalExercises?.[key]?.[name]?.length >
                                0 && (
                                <div>
                                  <p>Aux Work: </p>
                                  {additionalExercises?.[key]?.[name]?.map(
                                    (additionalSets, index) => (
                                      <div
                                        key={index}
                                        class="flex items-center"
                                      >
                                        <p class="m-0">
                                          {additionalSets.sets?.length} sets of{" "}
                                          {additionalSets.exercise?.name}
                                        </p>
                                        <button
                                          onClick={() =>
                                            openAuxExerciseModal({
                                              week: key,
                                              mainLift: name,
                                              title: sets.exercise,
                                              initialValues: {
                                                ...additionalSets,
                                                index,
                                              },
                                            })
                                          }
                                        >
                                          Edit Sets
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                              <div class="pt-6">
                                <button
                                  class="bg-blue-100"
                                  onClick={() =>
                                    openAuxExerciseModal({
                                      title: sets.exercise,
                                      week: key,
                                      mainLift: name,
                                    })
                                  }
                                >
                                  Add Aux Sets
                                </button>
                              </div>
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
        onRequestClose={() => {
          closeAuxExerciseModal()
        }}
      >
        <div>
          <AuxExerciseForm
            handleSubmit={handleAddAuxExercise}
            mainLift={auxExerciseFormData?.mainLift}
            title={auxExerciseFormData?.title}
            week={auxExerciseFormData?.week}
            initialValues={auxExerciseFormData?.initialValues || {}}
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
    </div>
  )
}
