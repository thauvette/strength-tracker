import { h } from "preact"
import Modal from "../modal/Modal"
import useExerciseHistory from "../../hooks/useExerciseHistory/useExerciseHistory"
import ExerciseStats from "../../routes/exercise/ExerciseStats"

const ExerciseHistoryModal = ({ isOpen, exerciseId, onRequestClose }) => {
  const [exerciseHistory, getData] = useExerciseHistory(exerciseId)

  return (
    <Modal onRequestClose={onRequestClose} isOpen={isOpen}>
      <>
        <h1>{exerciseHistory?.name}</h1>
        <ExerciseStats
          exerciseHistory={exerciseHistory}
          onChangeSet={getData}
        />
      </>
    </Modal>
  )
}

export default ExerciseHistoryModal
