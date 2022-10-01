import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import useDB, { objectStores } from '../../context/db/db'

const NewMuscleGroupForm = ({ onSubmit }) => {
  const { createEntry, getMuscleGroups } = useDB()
  const [groups, setGroups] = useState(null)

  useEffect(() => {
    getMuscleGroups().then((res) => {
      setGroups(Object.values(res || {}).filter((group) => group.isPrimary))
    })
  }, []) //eslint-disable-line

  const submit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const primaryGroup = formData.get('primaryGroup')

    await createEntry(objectStores.muscleGroups, {
      isPrimary: 0,
      parentGroup: +primaryGroup,
      name,
    })
    if (onSubmit) {
      onSubmit()
    }
  }

  return groups?.length ? (
    <form onSubmit={submit}>
      <div>
        <label>
          <p>Primary Group</p>
          <select name="primaryGroup" required>
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option value={group.id} key={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <p>Name</p>
        <input required type="text" name="name" placeholder="group" />
      </label>
      <div class="py-2">
        <button class="btn primary" type="submit">
          Save
        </button>
      </div>
    </form>
  ) : null
}

export default NewMuscleGroupForm
