import { h } from 'preact'
import { useState } from 'preact/hooks'
import { route } from 'preact-router'

import generateRandomId from '../../utilities.js/generateRandomId'
import Modal from '../../components/modal/Modal'
import AddExerciseForm from './AddExerciseForm'
import ReorderForm from '../wendler/newSchedule/components/reorderForm'
import useDB from '../../context/db/db'

import { routes } from '../../config/routes'
import Accordion from '../../components/accordion/accordion'
import EditableSet from '../../components/editableSet/editableSet'

const CreateRoutine = ({ initialValues }) => {
  const { createRoutine, updateRoutine } = useDB()
  const [routineName, setRoutineName] = useState(initialValues?.name || '')
  const [days, setDays] = useState(
    initialValues?.days || [
      {
        name: 'Day 1',
        id: generateRandomId(),
        sets: [],
      },
    ],
  )

  const [exerciseModalState, setExerciseModalState] = useState({
    isOpen: false,
    dayId: null,
    formType: '',
  })

  const addDay = () => {
    const number = days?.length + 1
    setDays([
      ...days,
      {
        name: `Day ${number}`,
        id: generateRandomId(),
        sets: [],
      },
    ])
  }
  const updateDayName = (id, value) => {
    setDays(
      days.map((day) =>
        id === day.id
          ? {
              ...day,
              name: value,
            }
          : day,
      ),
    )
  }
  const removeDay = (id) => setDays(days.filter((day) => day.id !== id))

  const addSets = (dayId, sets) => {
    setDays(
      days.map((day) =>
        day.id === dayId ? { ...day, sets: [...day.sets, ...sets] } : day,
      ),
    )
    setExerciseModalState({
      isOpen: false,
      dayId: null,
      formType: '',
    })
  }
  // pass null for set to remove it
  const editSet = ({ dayId, setId, set }) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            sets: day.sets
              .map((currentSet) => (currentSet.id === setId ? set : currentSet))
              ?.filter((currentSet) => !!currentSet),
          }
        }
        return day
      }),
    )
  }

  const reorderSets = (dayId, order) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            sets: order
              .map((index) => day.sets?.[index])
              .filter((set) => !!set),
          }
        }
        return day
      }),
    )
  }

  const submit = async () => {
    const data = {
      name: routineName,
      days: days.map((day) => ({
        name: day.name,
        id: day.id,
        sets:
          day.sets?.map((set) => ({
            weight: set.weight,
            reps: set.reps,
            exercise: set.exerciseId,
            exerciseName: set.exerciseName,
            id: set.id,
          })) || [],
      })),
    }
    let res
    try {
      if (initialValues?.id) {
        res = await updateRoutine(initialValues.id, data)
      } else {
        res = await createRoutine(data)
      }
    } catch (e) {}
    route(`${routes.routinesBase}/${res?.id}`)
  }

  return (
    <div class="px-2 py-4">
      <h1>New Routine</h1>
      <div>
        <div class="mb-4">
          <label>
            <p>Routine Name</p>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={routineName}
              onInput={(e) => setRoutineName(e.target.value)}
            />
          </label>
        </div>
        {days.map((day) => {
          return (
            <div key={day.id} class="py-4 border-b-2">
              <div class="flex justify-between">
                <input
                  type="text"
                  value={day.name || ''}
                  onInput={(e) => updateDayName(day.id, e.target.value)}
                />
                <button onClick={() => removeDay(day.id)}>x</button>
              </div>
              {day.sets.length ? (
                <div class="py-4">
                  {day.sets.map((set) => {
                    const { exerciseName, id, reps, weight, freeForm } = set
                    return (
                      <Accordion
                        key={id}
                        title={`${exerciseName} - ${
                          freeForm ? 'unknown sets' : `${reps} @ ${weight}`
                        }`}
                        titleClass="capitalize"
                        containerClass="border-b border-primary-600 mb-2"
                      >
                        <EditableSet
                          reps={set.reps}
                          weight={set.weight}
                          onChangeReps={(value) => {
                            editSet({
                              set: {
                                ...set,
                                reps: value,
                              },
                              dayId: day.id,
                              setId: set.id,
                            })
                          }}
                          onChangeWeight={(value) => {
                            editSet({
                              set: {
                                ...set,
                                weight: value,
                              },
                              dayId: day.id,
                              setId: set.id,
                            })
                          }}
                          handleRemove={() => {
                            editSet({
                              dayId: day.id,
                              set: null,
                              setId: set.id,
                            })
                          }}
                        />
                      </Accordion>
                    )
                  })}
                </div>
              ) : null}
              <div class="flex pt-4 gap-4">
                {day?.sets?.length ? (
                  <button
                    class="border border-primary-600 text-primary-600 flex-1"
                    onClick={() =>
                      setExerciseModalState({
                        isOpen: true,
                        dayId: day.id,
                        formType: 'edit',
                      })
                    }
                  >
                    Order / Remove sets
                  </button>
                ) : null}
                <button
                  class="bg-primary-600 text-white ml-auto flex-1"
                  onClick={() =>
                    setExerciseModalState({
                      isOpen: true,
                      dayId: day.id,
                      formType: 'add',
                    })
                  }
                >
                  + Add Exercise
                </button>
              </div>
            </div>
          )
        })}
        <button onClick={addDay}>+ Add a day</button>
        <div class="pt-8">
          <button onClick={submit} class="w-full bg-primary-900 text-white">
            Save Routine
          </button>
        </div>
      </div>
      {exerciseModalState.isOpen && (
        <Modal
          isOpen={exerciseModalState.isOpen}
          onRequestClose={() =>
            setExerciseModalState({
              isOpen: false,
              dayId: null,
              formType: '',
            })
          }
        >
          {exerciseModalState.formType === 'edit' ? (
            <div>
              <ReorderForm
                hideAllWeeksCheckbox
                items={
                  days
                    .find((day) => day.id === exerciseModalState.dayId)
                    ?.sets?.map(({ exerciseName, reps, weight, freeForm }) => ({
                      label: freeForm
                        ? `${exerciseName} - unknown sets`
                        : `${exerciseName} - ${reps} @ ${weight}`,
                    })) || []
                }
                onSave={({ newOrder }) => {
                  reorderSets(exerciseModalState.dayId, newOrder)
                  setExerciseModalState({
                    isOpen: false,
                    dayId: null,
                    formType: '',
                  })
                }}
                allowEditAllWeeks={false}
              />
            </div>
          ) : (
            <AddExerciseForm
              submit={(sets) => addSets(exerciseModalState.dayId, sets)}
            />
          )}
        </Modal>
      )}
    </div>
  )
}

export default CreateRoutine
