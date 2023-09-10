import { h } from 'preact';
import { useState } from 'preact/hooks';

import Modal from '../modal/Modal';
import useExerciseHistory from '../../hooks/useExerciseHistory/useExerciseHistory';
import ExerciseStats from '../exerciseStats/ExerciseStats';

const OneRepMaxInput = ({ id, info, handleInput, formErrors }) => {
  const { exerciseHistory } = useExerciseHistory(id);
  const oneRepMax = exerciseHistory?.eorm?.max;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [historyModalIsOpen, setHistoryModalIsOpen] = useState(false);
  const [targetWeight, setTargetWeight] = useState(oneRepMax || info.weight);

  return (
    <div key={id} class="py-4 border-b-2">
      <div class="flex align-center justify-between">
        <label class="text-xl font-bold capitalize" htmlFor={id}>
          {info.name}
        </label>
        <button onClick={() => setHistoryModalIsOpen(true)}>Stats</button>
      </div>

      <input
        id={id}
        name={id}
        value={info.weight || ''}
        onInput={handleInput}
        class="py-3 px-2 text-base mb-2 w-full"
      />

      {formErrors?.[id] && <p>{formErrors[id]}</p>}
      <div class="flex flex-wrap gap-2 pt-4">
        {oneRepMax && (
          <button
            class="secondary"
            onClick={() => {
              handleInput({
                target: {
                  name: id,
                  value: Math.ceil(oneRepMax),
                },
              });
            }}
          >
            Set to EORM: {Math.ceil(oneRepMax)}
          </button>
        )}
        <button
          class="link"
          onClick={() => {
            setModalIsOpen(true);
            setTargetWeight(oneRepMax || info.weight);
          }}
        >
          Calculate from end goal
        </button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div>
          <p class="text-xl mb-4">Goal:</p>
          <label>
            <p>Weight of the heaviest set</p>
            <input
              class="w-full mb-2"
              onInput={(e) => setTargetWeight(+e.target.value)}
              value={targetWeight}
            />
          </label>
          <div class="pt-4">
            <p class="mb-2">
              Estimated one rep max of {Math.ceil(targetWeight / 0.9 / 0.95)}
            </p>
            <button
              class="primary w-full"
              onClick={() => {
                handleInput({
                  target: {
                    name: id,
                    value: Math.ceil(targetWeight / 0.9 / 0.95),
                  },
                });
                setModalIsOpen(false);
              }}
            >
              Set max to {Math.ceil(targetWeight / 0.9 / 0.95)}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={historyModalIsOpen}
        onRequestClose={() => {
          setHistoryModalIsOpen(false);
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
  );
};

export default OneRepMaxInput;
