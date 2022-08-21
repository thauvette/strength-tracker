import { h } from "preact"
import EditableSet from "../../../components/editableSet/editableSet"

import historyIcon from "../../../assets/icons/list-outline.svg"

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
                <button onClick={handleViewHistory}>
                  <img src={historyIcon} alt="view history" class="w-8" />
                </button>
              ) : null}
              {handleUndo ? (
                <button
                  class="w-1/2 secondary"
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
                class="w-1/2 primary px-4 py-2 ml-2"
                onClick={() => handleSubmit({ ...newValues })}
              >
                {completed ? "Update" : "Save"}
              </button>
            </div>
          )}
        />
      ) : (
        <button onClick={makeActive} class="text-left w-full">
          <div class="flex justify-between">
            <p class="capitalize text-xl font-bold">
              {completed && "✔️"}
              {title}
            </p>
            <p>
              {set.reps} @ {set.weight}
            </p>
          </div>
        </button>
      )}
    </div>
  )
}

export default Set
