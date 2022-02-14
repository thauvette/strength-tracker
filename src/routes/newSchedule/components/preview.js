import { h } from "preact"
import { useState } from "preact/compat"
import { route } from "preact-router"
import { set } from "lodash"

import Accordion from "../../../components/accordion/accordion"
import Modal from "../../../components/modal/Modal"
import { LOCAL_STORAGE_WORKOUT_KEY } from "../../../config/constants"

import AdditionalExerciseForm from "./additionalExerciseForm"
import AdditionalExercisesList from "./additionalExercisesList"

export default function Preview({ preview }) {
  const [viewByLift, setViewByLift] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  const [additionalExercises, setAdditionalExercises] = useState({})

  const [modalIsOpen, setModalIsOpen] = useState(false)
  if (!preview || !Object.keys(preview).length) {
    return null
  }

  const previewByLift = Object.entries(preview).reduce((obj, [key, week]) => {
    Object.entries(week).forEach(([name, data]) => {
      if (!obj[name]) {
        obj[name] = {}
      }
      obj[name][key] = data
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
    const key = Date.now()
    const localWorkouts = localStorage.getItem(LOCAL_STORAGE_WORKOUT_KEY)

    const currentWorkouts = localWorkouts ? JSON.parse(localWorkouts) : {}

    const mainLifts = { ...preview }

    Object.entries(additionalExercises).forEach(([week, lifts]) => {
      Object.entries(lifts).forEach(([liftName, sets]) => {
        if (!mainLifts?.[week]?.[liftName].additional) {
          set(mainLifts, [week, liftName, "additional"], [])
        }

        mainLifts?.[week]?.[liftName].additional?.push(...sets)
      })
    })

    currentWorkouts[key] = {
      title: formData?.title || "",
      description: formData?.description || "",
      weeks: mainLifts,
    }
    localStorage.setItem(
      LOCAL_STORAGE_WORKOUT_KEY,
      JSON.stringify(currentWorkouts)
    )
    route("/")
  }

  function handleAdditionalExercise({ exercise, mainLift }) {
    const currentValues = { ...additionalExercises }

    let weekIndex = 1
    while (weekIndex <= 3) {
      if (!currentValues[weekIndex]) {
        currentValues[weekIndex] = {}
      }
      if (!currentValues[weekIndex][mainLift]) {
        currentValues[weekIndex][mainLift] = []
      }
      currentValues[weekIndex][mainLift].push(...exercise)
      weekIndex += 1
    }

    setAdditionalExercises({ ...currentValues })
  }

  function handleAuxExerciseEdit({ week, mainLift, index, lift }) {
    const currentValues = { ...additionalExercises }

    currentValues[week][mainLift][index] = lift

    setAdditionalExercises(currentValues)
  }

  function handleAuxExerciseRemove({ week, mainLift, index }) {
    const currentValues = { ...additionalExercises }
    const currentArray = currentValues[week][mainLift]

    currentArray.splice(index, 1)

    setAdditionalExercises({
      ...currentValues,
      [week]: {
        ...currentValues[week],
        [mainLift]: currentArray,
      },
    })
  }

  return (
    <div>
      <div class="flex justify-between align-center">
        <h2 class="text-lg">Preview</h2>
        <button onClick={() => setViewByLift(!viewByLift)}>
          {viewByLift ? "Sort by week" : "Sort by lift"}
        </button>
      </div>

      {viewByLift
        ? Object.entries(previewByLift).map(([name, weeks]) => (
            <div key={name} class="py-4">
              <h4>{name}</h4>
              <div class="divide-y">
                {Object.entries(weeks).map(([key, sets]) => (
                  <div key={key} class="py-2 ">
                    <Accordion title={`Week ${key}`} openByDefault>
                      <div>
                        <p>{name}</p>
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
                          <p>Additional Work</p>
                          {additionalExercises?.[key]?.[name]?.length > 0 && (
                            <AdditionalExercisesList
                              additionalExercises={
                                additionalExercises?.[key]?.[name]
                              }
                              onEdit={({ lift, index }) =>
                                handleAuxExerciseEdit({
                                  week: key,
                                  mainLift: name,
                                  lift,
                                  index,
                                })
                              }
                              onRemove={index =>
                                handleAuxExerciseRemove({
                                  week: key,
                                  mainLift: name,
                                  index,
                                })
                              }
                            />
                          )}
                          <AdditionalExerciseForm
                            onSubmit={exercise =>
                              handleAdditionalExercise({
                                exercise,
                                week: key,
                                mainLift: name,
                              })
                            }
                          />
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
                          <Accordion title={`${name} day`} openByDefault>
                            <div>
                              <p>{name}</p>
                              {sets.main.map(set => (
                                <p key={set.text}>{set.text}</p>
                              ))}
                              {sets.auxName}
                              {sets.aux.map((set, i) => (
                                <p key={set.text + i}>{set.text}</p>
                              ))}
                              {additionalExercises?.[key]?.[name]?.length >
                                0 && (
                                <AdditionalExercisesList
                                  additionalExercises={
                                    additionalExercises?.[key]?.[name]
                                  }
                                  onEdit={({ lift, index }) =>
                                    handleAuxExerciseEdit({
                                      week: key,
                                      mainLift: name,
                                      lift,
                                      index,
                                    })
                                  }
                                  onRemove={index =>
                                    handleAuxExerciseRemove({
                                      week: key,
                                      mainLift: name,
                                      index,
                                    })
                                  }
                                />
                              )}
                            </div>
                            <AdditionalExerciseForm
                              onSubmit={exercise =>
                                handleAdditionalExercise({
                                  exercise,
                                  week: key,
                                  mainLift: name,
                                })
                              }
                            />
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
