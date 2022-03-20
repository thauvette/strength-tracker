import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import useDB, { objectStores } from "../context/db"

const ExerciseForm = ({ onSubmit }) => {
  const { getExerciseOptions, createEntry } = useDB()
  const [loading, setLoading] = useState(true)
  const [primaryGroupOptions, setPrimaryGroupOptions] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    primaryGroup: "",
    altPrimary: "",
  })

  useEffect(() => {
    //   get all the current primaryGroup options.
    getExerciseOptions(objectStores.exercises, "primaryGroup")
      .then(res => {
        const uniq = []
        res?.forEach(item => {
          if (!uniq.some(val => val === item.primaryGroup)) {
            uniq.push(item.primaryGroup)
          }
        })
        setPrimaryGroupOptions(uniq)
      })
      .finally(() => setLoading(false))
  }, [getExerciseOptions])

  const submit = e => {
    const { name, primaryGroup, altPrimary } = formData

    const data = {
      name,
      primaryGroup:
        primaryGroup === "other"
          ? altPrimary.toLowerCase()
          : primaryGroup.toLowerCase(),
    }

    createEntry(objectStores.exercises, data)
      .then(res => {
        if (primaryGroup === "other") {
          setPrimaryGroupOptions(currentOptions => [
            ...currentOptions,
            altPrimary,
          ])
        }
        if (onSubmit) {
          e.stopPropagation()
          onSubmit(res)
        } else {
          setFormData({
            name: "",
            primaryGroup: "",
            altPrimary: "",
          })
        }
      })
      .catch(err => console.log(err))
  }

  const formIsValid =
    formData.name.length &&
    formData.primaryGroup.length &&
    (formData.primaryGroup !== "other" || formData.altPrimary?.length)

  return loading ? (
    <p>Loading</p>
  ) : (
    <div>
      <p>Add Exercise</p>
      <label>
        <p>Name</p>
        <input
          type="text"
          value={formData.name}
          onInput={e =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />
      </label>
      <div>
        <p>Primary Muscle Group</p>
        {!!primaryGroupOptions?.length && (
          <select
            value={formData.primaryGroup}
            onInput={e =>
              setFormData({
                ...formData,
                primaryGroup: e.target.value,
              })
            }
          >
            {primaryGroupOptions.map(option => (
              <option key={option} value={option} class="capitalize">
                {option}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
        )}
        {formData?.primaryGroup === "other" && (
          <div>
            <input
              type="text"
              onInput={e =>
                setFormData({
                  ...formData,
                  altPrimary: e.target.value,
                })
              }
            />
          </div>
        )}
      </div>
      <div class="pt-4">
        <button
          class={`text-white ${formIsValid ? "bg-blue-900" : "bg-gray-500"}`}
          disabled={!formIsValid}
          onClick={submit}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default ExerciseForm
