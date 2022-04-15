import { h } from "preact"
import { useState, useEffect } from "preact/compat"
import Preview from "./components/preview"

import style from "./newSchedule.scss"
import generateProgram from "../../utilities.js/generateProgram"
import useDB, { objectStores } from "../../context/db"

const wendlerCycleExercises = [
  "deadlift",
  "barbell bench press",
  "barbell back squat",
  "standing overhead press",
]

const NewSchedule = () => {
  const { getItemsByIndex } = useDB()
  // TODO: get these from previous workouts
  const [loading, setLoading] = useState(true)
  const [formErrors, setFormErrors] = useState({})
  const [exercises, setExercises] = useState({})
  const [generatedPreview, setGeneratedPreview] = useState(null)
  // needs to be two options. big but boring or less boring.  ✔️
  // then, TODO: first set last, or 5 x 10.
  const [auxVersion, setAuxVersion] = useState("")

  useEffect(() => {
    getItemsByIndex(objectStores.exercises, "name", wendlerCycleExercises)
      .then(res => {
        const formattedWendlerExercises = wendlerCycleExercises.reduce(
          (obj, exerciseName) => {

            const matchingDBData = res.find(item => item.name === exerciseName)
            if (matchingDBData) {
              return {
                ...obj,
                [matchingDBData.primaryId]: matchingDBData,
              }
            }
          },
          {}
        )
        setExercises(formattedWendlerExercises)
      })
      .catch(e => console.log(e))
      .finally(() => setLoading(false))
  }, [getItemsByIndex])

  function handleInput(e) {
    setExercises({
      ...exercises,
      [e.target.name]: {
        ...exercises[e.target.name],
        weight: +e.target.value || "",
      },
    })
  }

  async function generatePreview() {
    setFormErrors({})
    const errors = {}

    Object.values(exercises).forEach(exercise => {
      if (exercise?.weight === undefined || exercise?.weight < 0) {
        errors[exercise.primaryId] = "This is field required"
      }
    })

    if (Object.keys(errors)?.length) {
      return setFormErrors(errors)
    }

    setGeneratedPreview(
      generateProgram({
        exercises,
        auxVersion,

      })
    )
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
          <div key={key} class="pb-4">
            <label class="text-lg" htmlFor={key}>
              {info.name}
            </label>
            <br />
            <input
              id={key}
              name={key}
              value={info.weight || ""}
              onInput={handleInput}
              class="py-3 px-2 text-base"
            />
            {formErrors?.[key] && <p>{formErrors.[key]}</p>}
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="aux-type-select">
          <p>Aux style</p>
        </label>
        <select
          id="aux-type-select"
          value={auxVersion}
          onInput={e => setAuxVersion(e.target.value)}
          class="py-3 px-2 text-base"
        >
          <option value="">None</option>
          <option value="bbb">Big But Boring</option>
          <option value="bbslb">Big But Slightly Less Boring</option>
        </select>
      </div>
      <div class="py-4">
        <button class="primary" onClick={generatePreview}>
          Generate Preview
        </button>
        {generatedPreview && (
          <button onClick={() => setGeneratedPreview(null)}>Reset</button>
        )}
      </div>
      <hr />
      <Preview preview={generatedPreview} exercises={exercises} />
    </div>
  )
}

export default NewSchedule
