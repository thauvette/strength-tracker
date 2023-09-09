import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import Modal from '../modal/Modal';
import Plates from '../plates/plates';
import { LOCAL_STORAGE_PLATE_SETTINGS } from '../../config/constants';

interface SetAttributes {
  reps: number;
  weight: number;
  isWarmUp: boolean;
}

interface Props {
  handleChanges?: (set: SetAttributes) => void;
  reps?: number;
  weight?: number;
  isWarmUp?: boolean;
  handleRemove?: () => void;
  title?: string;
  titleClass?: string;
  onDuplicate?: () => void;
  renderCtas?: (set: SetAttributes) => void;
  disablePlateModal?: boolean;
  barWeight?: number;
}

const EditableSet = ({
  handleChanges,
  reps: initialReps = 0,
  weight: initialWeight,
  isWarmUp: initialIsWarmUp = false,
  handleRemove,
  title,
  titleClass,
  onDuplicate,
  renderCtas,
  disablePlateModal,
  barWeight,
}: Props) => {
  const [plateModalState, setPlateModalState] = useState({
    weight: initialWeight,
    isOpen: false,
  });
  const [reps, setReps] = useState(initialReps);
  const [weight, setWeight] = useState(initialWeight);
  const [isWarmUp, setIsWarmUp] = useState(initialIsWarmUp);

  let plateSettings;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      plateSettings = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_PLATE_SETTINGS),
      );
    } catch (err) {
      plateSettings = null;
    }
  }

  const defaultPlateWeight = plateSettings?.barWeight
    ? +plateSettings.barWeight
    : 45;

  useEffect(() => {
    if (handleChanges) {
      handleChanges({
        reps,
        weight,
        isWarmUp,
      });
    }
  }, [reps, weight, isWarmUp]); // eslint-disable-line

  return (
    <>
      <div class="py-1">
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
        <div class="mb-2 flex">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isWarmUp}
              onInput={(e: Event) => {
                if (e.target instanceof HTMLInputElement)
                  setIsWarmUp(e.target.checked);
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
                  const newValue = +reps > 1 ? +reps - 1 : 0;
                  setReps(newValue);
                }}
              >
                -
              </button>
              <input
                class="flex-1 w-full text-center"
                value={reps}
                onInput={(e: Event) => {
                  if (e.target instanceof HTMLInputElement) {
                    setReps(+e.target.value);
                  }
                }}
              />

              <button
                onClick={() => {
                  setReps(+reps + 1);
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
                  const remainder = +weight % 5;
                  const newWeight =
                    +weight > 5 ? +weight - (remainder || 5) : 0;
                  setWeight(newWeight);
                }}
              >
                -
              </button>
              <input
                class="flex-1 w-full text-center"
                value={weight}
                onInput={(e: Event) => {
                  if (e.target instanceof HTMLInputElement) {
                    setWeight(+e.target.value);
                  }
                }}
              />

              <button
                onClick={() => {
                  const newWeight = +weight + 5 - (+weight % 5);
                  setWeight(newWeight);
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
        <Plates
          weight={plateModalState.weight}
          barWeight={barWeight || defaultPlateWeight}
        />
      </Modal>
    </>
  );
};

export default EditableSet;
