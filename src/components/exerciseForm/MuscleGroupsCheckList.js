import { h } from 'preact'

const MuscleGroupsCheckList = ({ groups, formData, setFormData, formKey }) =>
  groups?.length
    ? groups.map((group) => (
        <div key={group.id}>
          <p class="uppercase font-bold border-b">{group.name}</p>
          {group.secondaryGroups?.length > 0 && (
            <div class="flex flex-wrap">
              {group.secondaryGroups.map((muscle) => (
                <label key={muscle.id} class="flex items-center px-2">
                  <input
                    type="checkbox"
                    class="mr-2"
                    checked={formData?.[formKey]?.some(
                      (muscleId) => muscleId === +muscle.id,
                    )}
                    onInput={(e) => {
                      let currentSelections = [...formData[formKey]]

                      if (e.target.checked) {
                        currentSelections.push(+muscle.id)
                      } else {
                        currentSelections = currentSelections.filter(
                          (id) => +id !== +muscle.id,
                        )
                      }

                      setFormData({
                        ...formData,
                        [formKey]: currentSelections,
                      })
                    }}
                  />
                  <p class="m-0 whitespace-nowrap">{muscle.name}</p>
                </label>
              ))}
            </div>
          )}
        </div>
      ))
    : null

export default MuscleGroupsCheckList
