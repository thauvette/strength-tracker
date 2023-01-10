import { h } from 'preact'
import { useState } from 'preact/hooks'
import { route } from 'preact-router'

import generateRandomId from '../../utilities.js/generateRandomId'
import Modal from '../../components/modal/Modal'
import AddExerciseForm from './AddExerciseForm'
import ReorderForm from '../wendler/newSchedule/components/reorderForm'
import useDB from '../../context/db/db'

import { routes } from '../../config/routes'

const CreateRoutine = () => {
  const { createRoutine } = useDB()
  const [routineName, setRoutineName] = useState('')
  const [days, setDays] = useState([
    {
      name: 'Day 1',
      id: generateRandomId(),
      sets: [],
    },
  ])

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

  const submit = () => {
    createRoutine({
      name: routineName,
      days: days.map((day) => ({
        name: day.name,
        sets:
          day.sets?.map((set) => ({
            weight: set.weight,
            reps: set.reps,
            exercise: set.exerciseId,
            exerciseName: set.exerciseName,
          })) || [],
      })),
    }).then((res) => {
      route(`${routes.routinesBase}/${res?.id}`)
    })
  }

  return (
    <div class="px-4">
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
                <div>
                  {day.sets.map(
                    ({ exerciseName, id, reps, weight, freeForm }) => (
                      <p key={id}>
                        {exerciseName} -{' '}
                        {freeForm ? 'unknown sets' : `${reps} @ ${weight}`}
                      </p>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setExerciseModalState({
                        isOpen: true,
                        dayId: day.id,
                        formType: 'edit',
                      })
                    }
                  >
                    Edit sets
                  </button>
                </div>
              ) : null}
              <button
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
          )
        })}
        <button onClick={addDay}>+ Add a day</button>
        <div class="pt-8">
          <button onClick={submit} class="w-full bg-blue-900 text-white">
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
