import { h } from 'preact';
import Modal from '../modal/Modal';
import ExerciseStats from '../exerciseStats/ExerciseStats';
import Icon from '../icon/Icon';
import LoadingSpinner from '../LoadingSpinner';

const ExerciseHistoryModal = ({
  isOpen,
  onRequestClose,
  exerciseHistory,
  onUpdate,
  isLoading,
}) => (
  <Modal onRequestClose={onRequestClose} isOpen={isOpen}>
    {isLoading ? (
      <div class="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    ) : (
      <>
        <div class="border-b-2 pb-2 mb-2">
          <div class="flex gap-2 mb-4">
            <h1 class="capitalize">{exerciseHistory?.name}</h1>
            {onRequestClose && (
              <div class="ml-auto">
                <button onClick={onRequestClose} ariLabel="dismiss">
                  <Icon name="close-circle-outline" width="28" />
                </button>
              </div>
            )}
          </div>
          {exerciseHistory?.notes && <p>{exerciseHistory.notes}</p>}
        </div>

        <ExerciseStats
          exerciseHistory={exerciseHistory}
          onChangeSet={onUpdate}
        />
      </>
    )}
  </Modal>
);

export default ExerciseHistoryModal;
