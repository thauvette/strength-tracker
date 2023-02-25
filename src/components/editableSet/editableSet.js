import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'

import Modal from '../modal/Modal'
import Plates from '../plates/plates'

const EditableSet = ({
  handleChanges,
  reps: initialReps,
  weight: initialWeight,
  isWarmUp: initialIsWarmUp = false,
  handleRemove,
  title,
  titleClass,
  onDuplicate,
  renderCtas,
  disablePlateModal,
}) => {
  const [plateModalState, setPlateModalState] = useState({
    weight: initialWeight,
    isOpen: false,
  })
  const [reps, setReps] = useState(initialReps)
  const [weight, setWeight] = useState(initialWeight)
  const [isWarmUp, setIsWarmUp] = useState(initialIsWarmUp)

  useEffect(() => {
    if (handleChanges) {
      handleChanges({
        reps,
        weight,
        isWarmUp,
      })
    }
  }, [reps, weight, isWarmUp]) // eslint-disable-line

  return (
    <>
      <div class="editable-set py-1">
        <div class="flex items-center justify-between">
          {title && (
            <p class={`m-0 ml-4 ${titleClass ? titleClass : ''}`}>{title}</p>
          )}

          {handleRemove && (
            <button class="ml-auto" onClick={handleRemove}>
              X
            </button>
          )}
        </div>
        <div class="mb-2">
          <label class="flex items-center gap-2 ">
            <input
              type="checkbox"
              checked={isWarmUp}
              onInput={(e) => {
                setIsWarmUp(e.target.checked)
              }}
            />

            <p>Warm up set.</p>
          </label>
        </div>
        <div class="flex pb-3">
          <div class="w-1/2 px-2">
            <p class="m-0 text-center">rep{reps > 1 ? 's' : ''}</p>
            <div class="flex items-center">
              <button
                disabled={reps === 0}
                onClick={() => {
                  const newValue = +reps > 1 ? +reps - 1 : 0
                  setReps(newValue)
                }}
              >
                -
              </button>
              <input
                class="flex-1 w-16 text-center"
                value={reps}
                onInput={(e) => {
                  setReps(e.target.value)
                }}
              />

              <button
                onClick={() => {
                  setReps(+reps + 1)
                }}
              >
                +
              </button>
            </div>
          </div>

          <div class="w-1/2 px-2">
            <p class="m-0 text-center">weight</p>
            <div class="flex items-center">
              <button
                disabled={weight <= 0}
                onClick={() => {
                  const remainder = +weight % 5
                  const newWeight = +weight > 5 ? +weight - (remainder || 5) : 0
                  setWeight(newWeight)
                }}
              >
                -
              </button>
              <input
                class="flex-1 w-16 text-center"
                value={weight}
                onInput={(e) => {
                  setWeight(e.target.value)
                }}
              />

              <button
                onClick={() => {
                  const newWeight = +weight + 5 - (+weight % 5)
                  setWeight(newWeight)
                }}
              >
                +
              </button>
            </div>
            {disablePlateModal ? null : (
              <div class="text-center">
                <button
                  onClick={() =>
                    setPlateModalState({
                      isOpen: true,
                      weight: +weight,
                    })
                  }
                  class="text-xs"
                >
                  plates?
                </button>
              </div>
            )}
          </div>
        </div>

        {onDuplicate && (
          <div class="flex justify-end pb-2">
            <button class="text-sm " onClick={onDuplicate}>
              Duplicate set
            </button>
          </div>
        )}

        {renderCtas && renderCtas({ weight, reps, isWarmUp })}
      </div>
      <Modal
        isOpen={plateModalState.isOpen}
        onRequestClose={() =>
          setPlateModalState({
            isOpen: false,
            weight: null,
          })
        }
      >
        <div>
          <button
            onClick={() =>
              setPlateModalState({
                isOpen: false,
                weight: null,
              })
            }
            class="float-right"
          >
            Close x
          </button>
        </div>
        <Plates weight={plateModalState.weight} />
      </Modal>
    </>
  )
}

export default EditableSet
