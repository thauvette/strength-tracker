import { h } from "preact"
import { useState } from "preact/compat"
import Preview from "./components/preview"

import style from "./newSchedule.scss"
import generateProgram from "../../utilities.js/generateProgram"

const exercises = {
  deadlift: 235,
  bench: 185,
  squat: 195,
  ohp: 110,
}

const NewSchedule = () => {
  const [maxes, setMaxes] = useState({ ...exercises })
  const [generatedPreview, setGeneratedPreview] = useState(null)
  const [auxVersion, setAuxVersion] = useState("bbb")
  // needs to be two options. big but boring or less boring.  ✔️
  // then, first set last, or 5 x 10.

  function handleInput(e) {
    setMaxes({
      ...maxes,
      [e.target.name]: e.target.value,
    })
  }

  function generatePreview() {
    setGeneratedPreview(
      generateProgram({ maxes, lessBoring: auxVersion === "bbslb" })
    )
  }

  return (
    <div class={`${style.home} px-2`}>
      <div>
        <h2 class="mb-2">One Rep Maxes</h2>
        {Object.keys(exercises).map(key => (
          <div key={key} class="pb-4">
            <label class="text-lg" htmlFor={key}>
              {key}
            </label>
            <br />
            <input
              id={key}
              name={key}
              value={maxes[key]}
              onInput={handleInput}
            />
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
        >
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
      <Preview preview={generatedPreview} maxes={maxes} />
    </div>
  )
}

export default NewSchedule
