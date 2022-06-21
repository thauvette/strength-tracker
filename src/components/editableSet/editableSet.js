import { h } from "preact"
import { useState } from "preact/hooks"

import calculatePlates from "../plates/calculatePlates"
import Modal from "../modal/Modal"
import Plates from "../plates/plates"

const EditableSet = ({
  onChangeReps,
  onChangeWeight,
  reps,
  weight,
  isComplete,
  onToggleComplete,
  handleRemove,
  title,
  onDuplicate,
}) => {
  const [plateModalState, setPlateModalState] = useState({
    weight: 0,
    isOpen: false,
  })
  return (
    <>
      <div class="py-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            {!!onToggleComplete && (
              <input
                type="checkbox"
                value={isComplete}
                checked={isComplete}
                onChange={e => onToggleComplete(e?.target?.checked)}
              />
            )}
            {title && <p class="m-0 ml-4">{title}</p>}
          </div>
          {handleRemove && <button onClick={handleRemove}>X</button>}
        </div>
        <div class="flex pb-3">
          <div class="w-1/2 px-2">
            <p class="m-0 text-center">rep{reps > 1 ? "s" : ""}</p>
            <div class="flex items-center">
              <button
                disabled={reps === 0}
                onClick={() => {
                  const newValue = +reps > 1 ? +reps - 1 : 0
                  onChangeReps(newValue)
                }}
              >
                -
              </button>
              <input
                class="flex-1 w-16 text-center"
                value={reps}
                onInput={e => onChangeReps(e.target.value)}
              />

              <button
                onClick={() => {
                  onChangeReps(+reps + 1)
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
                  onChangeWeight(+weight > 5 ? +weight - (remainder || 5) : 0)
                }}
              >
                -
              </button>
              <input
                class="flex-1 w-16 text-center"
                value={weight}
                onInput={e => onChangeWeight(e.target.value)}
              />

              <button
                onClick={() => {
                  onChangeWeight(+weight + 5 - (+weight % 5))
                }}
              >
                +
              </button>
            </div>
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
          </div>
        </div>
        {onDuplicate && (
          <button class="text-sm float-right" onClick={onDuplicate}>
            Duplicate set
          </button>
        )}
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
