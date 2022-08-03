import { h } from "preact"
import { useState } from "preact/hooks"
import EditableSet from "../../../../components/editableSet/editableSet"
import ExerciseSearch from "../../../../components/exerciseSelection/ExerciseSearch"

const AuxExerciseForm = ({
  week,
  handleSubmit,
  initialValues,
  title,
  onCancel,
}) => {
  const [sets, setSets] = useState(
    initialValues?.sets || [{ reps: "", weight: "" }]
  )
  const [exercise, setExercise] = useState(initialValues?.exercise || null)

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

  return exercise?.id ? (
    <div>
      <div class="flex items-center justify-between">
        <h2>
          Adding to {title} {addToAllWeeks ? "" : `week ${week}`}
        </h2>
        <button onClick={onCancel}>X Cancel</button>
      </div>
      <label class="flex items-center">
        <input
          type="checkbox"
          class="mr-2"
          checked={addToAllWeeks}
          onInput={e => setAddToAllWeeks(e.target.checked)}
        />
        <p class="m-0">Add to all {title} days</p>
      </label>
      <p class="text-sm mb-2">*each week can be further customized</p>

      <div class="flex items-center">
        <button onClick={() => setExercise(null)}>← Back</button>
        <h2 class="capitalize">{exercise?.name}</h2>
      </div>

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
              disablePlateModal
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
  ) : (
    <ExerciseSearch handleSelectExercise={setExercise} />
  )
}

export default AuxExerciseForm
