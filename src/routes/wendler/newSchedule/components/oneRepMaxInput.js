import { h } from "preact"
import { useState } from "preact/hooks"

import Modal from "../../../../components/modal/Modal"
import useExerciseHistory from "../../../../hooks/useExerciseHistory/useExerciseHistory"
import ExerciseStats from "../../../exercise/ExerciseStats"

const OneRepMaxInput = ({ id, info, handleInput, formErrors }) => {
  const [exerciseHistory] = useExerciseHistory(id)
  const oneRepMax = exerciseHistory?.eorm?.max
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [historyModalIsOpen, setHistoryModalIsOpen] = useState(false)
  const [targetWeight, setTargetWeight] = useState(oneRepMax || info.weight)

  return (
    <div key={id} class="py-4 border-b-2">
      <div class="flex align-center justify-between">
        <label class="text-lg capitalize" htmlFor={id}>
          {info.name}
        </label>
        <button onClick={() => setHistoryModalIsOpen(true)}>Stats</button>
      </div>
      <div>
        <input
          id={id}
          name={id}
          value={info.weight || ""}
          onInput={handleInput}
          class="py-3 px-2 text-base"
        />
      </div>
      {formErrors?.[id] && <p>{formErrors[id]}</p>}
      {oneRepMax && (
        <button
          class="my-2 bg-blue-200"
          onClick={() => {
            handleInput({
              target: {
                name: id,
                value: Math.ceil(oneRepMax),
              },
            })
          }}
        >
          Set to EORM: {Math.ceil(oneRepMax)}
        </button>
      )}
      <button
        class="bg-red-200"
        onClick={() => {
          setModalIsOpen(true)
          setTargetWeight(oneRepMax || info.weight)
        }}
      >
        Calculate from end goal
      </button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div>
          <p>Goal:</p>
          <input
            onInput={e => setTargetWeight(+e.target.value)}
            value={targetWeight}
          />
          <div class="pt-4">
            <button
              class="bg-blue-200"
              onClick={() => {
                handleInput({
                  target: {
                    name: id,
                    value: Math.ceil(targetWeight / 0.9 / 0.95),
                  },
                })
                setModalIsOpen(false)
              }}
            >
              Set max to: {Math.ceil(targetWeight / 0.9 / 0.95)}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={historyModalIsOpen}
        onRequestClose={() => {
          setHistoryModalIsOpen(false)
        }}
      >
        <div>
          <div class="flex items-center justify-between">
            <p class="capitalize">{info.name}</p>
            <button onClick={() => setHistoryModalIsOpen(false)}>
              Close X
            </button>
          </div>
          <ExerciseStats exerciseHistory={exerciseHistory} />
        </div>
      </Modal>
    </div>
  )
}

export default OneRepMaxInput
