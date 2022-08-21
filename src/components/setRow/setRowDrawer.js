import dayjs from "dayjs"
import { h } from "preact"
import EditableSet from "../editableSet/editableSet"
import SetNoteForm from "../setNoteForm/SetNoteForm"

const SetRowDrawer = ({
  set,
  drawerContent,
  onChangeSet,
  closeDrawer,
  handleUpdateSet,
  handleDeleteSet,
}) => {
  if (!drawerContent) {
    return null
  }

  if (drawerContent === "edit") {
    return (
      <EditableSet
        reps={set.reps}
        weight={set.weight}
        renderCtas={data => {
          return (
            <div class="flex">
              <div class="flex-1 text-center">
                <button
                  class="primary"
                  onClick={() => {
                    handleUpdateSet({
                      weight: data.weight,
                      reps: data.reps,
                      id: set.id,
                    })
                  }}
                >
                  Update
                </button>
              </div>
              <div class="flex-1  text-center">
                <button class="secondary" onClick={closeDrawer}>
                  Cancel
                </button>
              </div>
            </div>
          )
        }}
      />
    )
  }
  if (drawerContent === "note") {
    // text, onSave, id
    return <SetNoteForm id={set.id} text={set.note} onSave={onChangeSet} />
  }

  if (drawerContent === "delete") {
    return (
      <div class="py-4">
        <p>Are you sure you want to delete this set?</p>
        <p>This action can not be undone</p>
        <div class="flex pt-4">
          <div class="flex-1 text-center">
            <button class="warning" onClick={handleDeleteSet}>
              Yup, ditch it.
            </button>
          </div>
          <div class="flex-1 text-center">
            <button onClick={closeDrawer} class="secondary">
              Nope, keep it.
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (drawerContent === "stats") {
    return (
      <div>
        <p>Logged: {dayjs(set.created).format("MMM DD, YYYY h:mm a")}</p>
        {set.updated && (
          <p>Updated: {dayjs(set.updated).format("MMM DD, YYYY h:mm a")}</p>
        )}
        <p>Estimated one rep max: {set.estOneRepMax}</p>
        {set.note && <p>Note: {set.note}</p>}
      </div>
    )
  }

  return null
}
export default SetRowDrawer
