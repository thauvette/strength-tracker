import { h } from "preact"
import EditableSet from "../../../components/editableSet/editableSet"

const Set = ({
  handleSubmit,
  handleUndo,
  isActive,
  makeActive,
  set,
  setNumber,
  title,
}) => {
  const { reps, weight, completed } = set
  return (
    <div class="border-b py-4">
      {isActive ? (
        <div>
          <EditableSet
            reps={reps}
            weight={weight}
            isComplete={!!completed}
            title={`${completed ? "✔️" : ""} Set ${setNumber}`}
            renderCtas={newValues => (
              <div class="flex py-4 px-2">
                <button
                  class="w-1/2 bg-gray-400 text-gray-900"
                  onClick={() =>
                    handleUndo({
                      ...newValues,
                    })
                  }
                >
                  Undo
                </button>
                <button
                  class="w-1/2 bg-blue-900 text-white text-bold px-4 py-2 ml-2"
                  onClick={() => handleSubmit({ ...newValues })}
                >
                  {completed ? "Update" : "Save"}
                </button>
              </div>
            )}
          />
        </div>
      ) : (
        <button onClick={makeActive}>
          <p class="capitalize">
            {completed && "✔️"}
            {title} Set {setNumber}
          </p>
          {set.reps} @ {set.weight}
        </button>
      )}
    </div>
  )
}

export default Set