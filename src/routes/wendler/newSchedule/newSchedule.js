import { h } from 'preact'
import { useState, useEffect } from 'preact/compat'

import style from './newSchedule.scss'
import generateProgram from '../../../utilities.js/generateProgram'
import useDB, { objectStores } from '../../../context/db/db'

import OneRepMaxInput from './components/oneRepMaxInput'
import { route } from 'preact-router'
import { routes } from '../../../config/routes'

const wendlerCycleExercises = [
  'deadlift',
  'barbell bench press',
  'barbell back squat',
  'standing overhead press',
]

const NewSchedule = ({ onSubmit, initialValues }) => {
  const { getItemsByIndex, getAllEntries } = useDB()
  const [loading, setLoading] = useState(true)
  const [formErrors, setFormErrors] = useState({})
  const [exercises, setExercises] = useState(initialValues?.exercises || {})
  const [auxVersion, setAuxVersion] = useState(initialValues?.auxVersion || '')

  useEffect(() => {
    if (initialValues) {
      setLoading(false)
      return
    }
    const promises = [
      getItemsByIndex(objectStores.exercises, 'name', wendlerCycleExercises),
      getAllEntries(objectStores.wendlerCycles),
    ]
    Promise.all(promises)
      .then((responses) => {
        const formattedWendlerExercises = wendlerCycleExercises.reduce(
          (obj, exerciseName) => {
            const matchingDBData = responses[0].find(
              (item) => item.name === exerciseName,
            )
            if (matchingDBData) {
              return {
                ...obj,
                [matchingDBData.primaryId]: matchingDBData,
              }
            }
          },
          {},
        )
        let lastWeights = null
        if (responses[1] && Object.keys(responses[1])?.length) {
          lastWeights = Object.values(responses[1]).sort((a, b) => {
            return a.created > b.created ? -1 : 1
          })[0]?.exerciseFormValues
        }
        setExercises({
          ...formattedWendlerExercises,
          ...(lastWeights || {}),
        })
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false))
  }, [getItemsByIndex, getAllEntries, initialValues])

  function handleInput(e) {
    setExercises({
      ...exercises,
      [e.target.name]: {
        ...exercises[e.target.name],
        weight: +e.target.value || '',
      },
    })
  }

  async function generatePreview() {
    setFormErrors({})
    const errors = {}

    Object.values(exercises).forEach((exercise) => {
      if (exercise?.weight === undefined || exercise?.weight < 0) {
        errors[exercise.primaryId] = 'This is field required'
      }
    })

    if (Object.keys(errors)?.length) {
      return setFormErrors(errors)
    }
    const preview = generateProgram({
      exercises,
      auxVersion,
      initialValues,
    })

    onSubmit({ exercises, preview, auxVersion })
    route(routes.wendlerNewPreview)
  }

  return loading ? (
    <div class="text-center pt-4">
      <p>Loading</p>
    </div>
  ) : (
    <div class={`${style.home} px-2`}>
      <div>
        <h2 class="mb-2">One Rep Maxes</h2>
        {Object.entries(exercises).map(([key, info]) => (
          <OneRepMaxInput
            key={key}
            id={key}
            info={info}
            handleInput={handleInput}
            formErrors={formErrors}
          />
        ))}
      </div>
      <div>
        <label htmlFor="aux-type-select">
          <p>Aux style</p>
        </label>
        <select
          id="aux-type-select"
          value={auxVersion}
          onInput={(e) => setAuxVersion(e.target.value)}
          class="py-3 px-2 text-base"
        >
          <option value="">None</option>
          <option value="fsl">First Set Last</option>
          <option value="bbb">Big But Boring</option>
          <option value="bbslb">Big But Slightly Less Boring</option>
        </select>
      </div>
      <div class="py-4">
        <button class="primary" onClick={generatePreview}>
          Generate Preview
        </button>
      </div>
    </div>
  )
}

export default NewSchedule
