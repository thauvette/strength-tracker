import { h } from 'preact'
import EditableSet from '../../../components/editableSet/editableSet'
import Icon from '../../../components/icon/Icon'

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
          title={
            <>
              {completed ? (
                <Icon name="checkmark" class="text-2xl mr-2" />
              ) : null}{' '}
              {title}
            </>
          }
          titleClass="capitalize font-bold flex items-center"
          renderCtas={(newValues) => (
            <div class="flex py-4 px-2">
              {handleViewHistory ? (
                <button
                  onClick={handleViewHistory}
                  ariaLabel="view history"
                  class="text-2xl"
                >
                  <div class="flex items-center">
                    <Icon name="list-outline" />
                  </div>
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
                {completed ? 'Update' : 'Save'}
              </button>
            </div>
          )}
        />
      ) : (
        <button onClick={makeActive} class="text-left w-full">
          <div class="flex justify-between flex-wrap">
            <p class="capitalize font-bold flex items-center">
              {completed && <Icon name="checkmark" class="text-2xl mr-2" />}
              {title}
            </p>
            <p class="shrink-0">
              {set.reps} @ {set.weight}
            </p>
          </div>
        </button>
      )}
    </div>
  )
}

export default Set
