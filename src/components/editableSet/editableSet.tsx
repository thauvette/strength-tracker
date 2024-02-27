import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

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
  const isMounted = useRef(false);
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
    if (isMounted.current && handleChanges) {
      if (handleChanges) {
        handleChanges({
          reps,
          weight,
          isWarmUp,
        });
      }
    } else {
      isMounted.current = true;
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
        <div class="pb-3 ">
          {/* REPS  */}
          <div class="flex justify-between items-center pb-4 border-b">
            <p class="m-0 font-bold uppercase">Rep{reps > 1 ? 's' : ''}</p>
            <div class="flex items-center justify-end">
              <button
                disabled={reps === 0}
                onClick={() => {
                  const newValue = +reps > 1 ? +reps - 1 : 0;
                  setReps(newValue);
                }}
                class="w-[48px] h-[48px] border-1 border-gray-400 dark:border-white"
              >
                -
              </button>
              <input
                class="w-[48px] text-center border-0"
                inputMode="numeric"
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
                class="w-[48px] h-[48px] border-1 border-gray-400 dark:border-white"
              >
                +
              </button>
            </div>
          </div>
          {/* WEIGHT */}
          <div class="flex justify-between items-center py-4">
            <div>
              <p class="m-0 font-bold uppercase">Weight</p>
              {disablePlateModal ? null : (
                <div class="text-center">
                  <button
                    onClick={() =>
                      setPlateModalState({
                        isOpen: true,
                        weight: +weight,
                      })
                    }
                    class="text-xs text-left"
                  >
                    plates?
                  </button>
                </div>
              )}
            </div>
            <div class="flex items-center justify-end">
              <button
                disabled={weight <= 0}
                onClick={() => {
                  const remainder = +weight % 5;
                  const newWeight =
                    +weight > 5 ? +weight - (remainder || 5) : 0;
                  setWeight(newWeight);
                }}
                class="w-[48px] h-[48px] border-1 border-gray-400 dark:border-white"
              >
                -
              </button>
              <input
                class="w-[48px] text-center border-0"
                value={weight}
                inputMode="numeric"
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
                class="w-[48px] h-[48px] border-1 border-gray-400 dark:border-white"
              >
                +
              </button>
            </div>
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
