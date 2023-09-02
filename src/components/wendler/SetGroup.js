import { h } from 'preact';
import { useState } from 'preact/hooks';
import Modal from '../../../components/modal/Modal';
import useExerciseHistory from '../../../hooks/useExerciseHistory/useExerciseHistory';
import ExerciseStats from '../../../components/exerciseStats/ExerciseStats';
import Set from './Set';

const SetGroup = ({
  title,
  exerciseId,
  sets,
  isActiveGroup,
  activeSet,
  setActiveSet,
  handleUndoSet,
  handleSubmitSet,
}) => {
  const [historyModalIsOpen, setHistoryModalIsOpen] = useState(false);
  const [exerciseHistory, getHistory] = useExerciseHistory(exerciseId);

  const handleOpenHistoryModal = () => {
    getHistory();
    setHistoryModalIsOpen(true);
  };

  return (
    <div>
      <div class="flex align-center justify-between sticky top-0 bg-primary-50 px-4 py-2 border-b-4">
        <p class="font-bold uppercase text-lg">{title}</p>
        <button onClick={handleOpenHistoryModal}>history</button>
      </div>
      {historyModalIsOpen && (
        <Modal
          isOpen={historyModalIsOpen}
          onRequestClose={() => setHistoryModalIsOpen(false)}
        >
          <div>
            <div class="flex items-center justify-between">
              <p class="font-bold capitalize">{title}</p>
              <button onClick={() => setHistoryModalIsOpen(false)}>
                close X
              </button>
            </div>
            <ExerciseStats exerciseHistory={exerciseHistory} />
          </div>
        </Modal>
      )}
      {sets?.length > 0 &&
        sets.map((set, setIndex) => {
          return (
            <Set
              key={setIndex}
              set={set}
              title={title}
              setNumber={setIndex + 1}
              isActive={isActiveGroup && activeSet === setIndex}
              makeActive={() => setActiveSet(setIndex)}
              handleSubmit={(newValues) => {
                handleSubmitSet({
                  set,
                  setIndex,
                  weight: newValues.weight,
                  reps: newValues.reps,
                });
              }}
              handleUndo={(newValues) => {
                handleUndoSet({
                  set,
                  setIndex,
                  weight: newValues.weight,
                  reps: newValues.reps,
                });
              }}
            />
          );
        })}
    </div>
  );
};

export default SetGroup;
