import { h } from "preact"
import EditableSet from "../../../components/editableSet/editableSet"

const Set = ({
  handleSubmit,
  handleUndo,
  isActive,
  makeActive,
  set,
  title,
  handleViewHistory,
}) => {
  const { reps, weight, completed } = set
  return (
    <div class="border-b py-4">
      {isActive ? (
        <EditableSet
          reps={reps}
          weight={weight}
          isComplete={!!completed}
          title={`${completed ? "✔️" : ""}  ${title}`}
          titleClass="capitalize text-xl font-bold"
          renderCtas={newValues => (
            <div class="flex py-4 px-2">
              {handleViewHistory ? (
                <button onClick={handleViewHistory}>History</button>
              ) : null}
              {handleUndo ? (
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
              ) : null}
              <button
                class="w-1/2 bg-blue-900 text-white text-bold px-4 py-2 ml-2"
                onClick={() => handleSubmit({ ...newValues })}
              >
                {completed ? "Update" : "Save"}
              </button>
            </div>
          )}
        />
      ) : (
        <button onClick={makeActive} class="text-left w-full">
          <p class="capitalize text-xl font-bold">
            {completed && "✔️"}
            {title}
          </p>
          <p>
            {set.reps} @ {set.weight}
          </p>
        </button>
      )}
    </div>
  )
}

export default Set
