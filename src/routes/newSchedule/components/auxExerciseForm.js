import { h } from "preact"
import { useState } from "preact/hooks"
import EditableSet from "../../../components/editableSet/editableSet"

const AuxExerciseForm = ({ mainLift, week, handleSubmit, initialValues }) => {
  const [sets, setSets] = useState(
    initialValues?.sets || [{ reps: "", weight: "" }]
  )
  const [exercise, setExercise] = useState(initialValues?.exercise || "")

  const [addToAllWeeks, setAddToAllWeeks] = useState(true)

  const handleInput = ({ index, key, value }) => {
    const currentSets = [...sets]
    currentSets[index] = {
      ...currentSets[index],
      [key]: value,
    }
    setSets(currentSets)
  }

  const handleRemoveSet = index => {
    const currentSets = [...sets]

    if (currentSets[index]) {
      currentSets.splice(index, 1)
      setSets(currentSets)
    }
  }

  const addSet = () => {
    setSets([...sets, { reps: "", weight: "" }])
  }

  const duplicateSet = values => {
    setSets([...sets, { ...values }])
  }

  const save = () => {
    handleSubmit({ exercise, sets, addToAllWeeks })
  }

  return (
    <div>
      <p>
        Adding to {mainLift} week {week}
      </p>
      <label class="flex items-center">
        <input
          type="checkbox"
          class="mr-2"
          checked={addToAllWeeks}
          onInput={e => setAddToAllWeeks(e.target.checked)}
        />
        <p class="m-0">Add to all {mainLift} days</p>
      </label>
      <p class="text-sm">*each week can be further customized</p>
      <label htmlFor="exercise-name">
        <p>Exercise</p>
        <input value={exercise} onInput={e => setExercise(e.target.value)} />
      </label>
      {sets.map((setValues, index) => {
        return (
          <div key={index} class="border-b pb-6">
            <EditableSet
              onChangeReps={value =>
                handleInput({
                  index,
                  key: "reps",
                  value,
                })
              }
              onChangeWeight={value =>
                handleInput({
                  index,
                  key: "weight",
                  value,
                })
              }
              reps={setValues?.reps || ""}
              weight={setValues?.weight || ""}
              handleRemove={e => {
                e.stopPropagation()
                handleRemoveSet(index)
              }}
              handleAddSet={addSet}
              title={`Set ${index + 1}`}
              onDuplicate={() => duplicateSet(setValues)}
            />
          </div>
        )
      })}
      <div class="border-b py-2">
        <button class="bg-blue-200" onClick={addSet}>
          + add set
        </button>
      </div>
      <div class="py-2">
        <button
          class="bg-yellow-200  w-full"
          onClick={save}
          disabled={!exercise || !sets.length}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default AuxExerciseForm
