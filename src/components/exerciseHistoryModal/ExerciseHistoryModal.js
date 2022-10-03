import { h } from 'preact'
import Modal from '../modal/Modal'
import ExerciseStats from '../exerciseStats/ExerciseStats'
import Icon from '../icon/Icon'

const ExerciseHistoryModal = ({
  isOpen,
  onRequestClose,
  exerciseHistory,
  onUpdate,
}) => (
  <Modal onRequestClose={onRequestClose} isOpen={isOpen}>
    <>
      <div class="flex items-center justify-between border-b-2 pb-4 mb-4">
        <h1 class="capitalize">{exerciseHistory?.name}</h1>
        {onRequestClose && (
          <button onClick={onRequestClose} ariLabel="dismiss" class="text-3xl">
            <Icon name="close-circle-outline" />
          </button>
        )}
      </div>
      <ExerciseStats exerciseHistory={exerciseHistory} onChangeSet={onUpdate} />
    </>
  </Modal>
)

export default ExerciseHistoryModal
