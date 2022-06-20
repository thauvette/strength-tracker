import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import useExerciseHistory from "../hooks/useExerciseHistory"

import Modal from "../components/modal/Modal"

import ExerciseHistory from "../routes/exercise/ExerciseHistory"

const ExerciseHistoryModal = ({ id, triggerText = "View History" }) => {
  const [exerciseHistory, getData] = useExerciseHistory(id)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    if (modalIsOpen) {
      getData()
    }
  }, [getData, modalIsOpen])

  return (
    <>
      {/* Trigger */}
      <button onClick={() => setModalIsOpen(true)}>{triggerText}</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div>
          <div class="flex items-center justify-between">
            <p class="capitalize font-bold text-lg">{exerciseHistory?.name}</p>
            <button onClick={() => setModalIsOpen(false)}>Close x</button>
          </div>
          <ExerciseHistory exerciseHistory={exerciseHistory} />
        </div>
      </Modal>
    </>
  )
}

export default ExerciseHistoryModal
