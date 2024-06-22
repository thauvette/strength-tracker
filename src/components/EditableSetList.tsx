import { h } from 'preact';
import { Reorder, useMotionValue } from 'framer-motion';
import { useRaisedShadow } from './routines/useRaisedBoxShadow';
import EditableSet from './editableSet/editableSet';
import { useCallback, useState } from 'preact/hooks';
import Icon from './icon/Icon';
import AnimateHeight from 'react-animate-height';
import generateRandomId from '../utilities.js/generateRandomId';

export type Set = {
  reps: number;
  weight: number;
  isWarmUp: boolean;
  id: string;
  exerciseId: number;
  exerciseName: string;
  musclesWorked?: number[];
  secondaryMusclesWorked?: number[];
  // TODO: include notes in routine sets
};
interface Props {
  sets: Set[];
  setSets: (sets: Set[]) => void;
}

const OrderItem = ({ set }: { set: Set }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  return (
    <Reorder.Item value={set} style={{ y, boxShadow, cursor: 'grab' }}>
      <div class="card mb-2 p-2 rounded-none">
        <div className="flex">
          <div class="flex flex-wrap items-center gap-2">
            <Icon name="reorder-two-outline" width="12" />
            <p class="capitalize font-bold text-sm">
              {set.exerciseName}
              {' - '}
            </p>
            <p class="capitalize font-bold text-sm">
              {set.reps} @ {set.weight}
            </p>
            {set.isWarmUp ? (
              <p class="text-xs font-normal"> (warm up)</p>
            ) : null}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

const SetItem = ({
  set,
  handleRemove,
  handleEditSet,
  handleDuplicateSet,
}: {
  set: Set;
  handleRemove: (id: string) => void;
  handleEditSet: (set: Set) => void;
  handleDuplicateSet: (set: Set) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const removeSet = useCallback(() => {
    handleRemove(set.id);
  }, [set.id, handleRemove]);

  return (
    <div>
      <div class="card mb-2 p-2 rounded-none">
        <div className="flex">
          <div class="flex flex-wrap items-center gap-2">
            <p class="capitalize font-bold">
              {set.exerciseName}
              {' - '}
            </p>
            <p class="capitalize font-bold">
              {set.reps} @ {set.weight}
            </p>
            {set.isWarmUp ? (
              <p class="text-xs font-normal"> (warm up)</p>
            ) : null}
          </div>

          <button class="ml-auto" onClick={toggleOpen}>
            <div
              class={`flex items-center transform transition-all duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            >
              <Icon name="chevron-down-outline" />
            </div>
          </button>
        </div>
        <AnimateHeight duration={200} height={isOpen ? 'auto' : 0}>
          <div class="px-2">
            <EditableSet
              weight={set.weight}
              reps={set.reps}
              isWarmUp={set.isWarmUp}
              disablePlateModal
              handleChanges={(args) => {
                handleEditSet({
                  ...set,
                  ...args,
                });
              }}
            />
            <div class="flex gap-2">
              <button
                class="secondary flex-1 py-1 text-sm"
                onClick={() => handleDuplicateSet(set)}
              >
                Duplicate
              </button>
              <button class="warning flex-1 py-1 text-sm" onClick={removeSet}>
                Remove
              </button>
            </div>
          </div>
        </AnimateHeight>
      </div>
    </div>
  );
};

const EditableSetList = ({ sets, setSets }: Props) => {
  const [isReordering, setIsReordering] = useState(false);
  const handleEditSet = (set: Set) => {
    setSets(
      sets.map((currentSet) => (set.id === currentSet.id ? set : currentSet)),
    );
  };

  const handleRemoveSet = (id: string) => {
    setSets(sets.filter((set) => set.id !== id));
  };

  const handleDuplicateSet = (duplicate) => {
    const current = [...sets];
    const index = sets.findIndex((set) => set.id === duplicate.id);
    current.splice(index + 1, 0, {
      ...duplicate,
      id: generateRandomId(),
    });
    setSets(current);
  };

  return (
    <div>
      <div class="py-4 flex items-center gap-2">
        <button
          onClick={() => setIsReordering(false)}
          class={`${isReordering ? '' : 'bg-highlight-600'}`}
        >
          Edit Sets
        </button>
        <button
          onClick={() => setIsReordering(true)}
          class={`${isReordering ? 'bg-highlight-600' : ''}`}
        >
          Reorder Sets
        </button>
      </div>
      {sets.length ? (
        <div class="mb-4">
          <div class="px-4 ">
            {isReordering ? (
              <div class="pl-4">
                <Reorder.Group
                  axis="y"
                  values={sets}
                  onReorder={setSets}
                  style={{ position: 'relative' }}
                >
                  {sets.map((item) => (
                    <OrderItem set={item} key={item.id} />
                  ))}
                </Reorder.Group>
              </div>
            ) : (
              <div>
                {sets.map((item) => (
                  <SetItem
                    set={item}
                    key={item.id}
                    handleEditSet={handleEditSet}
                    handleRemove={handleRemoveSet}
                    handleDuplicateSet={handleDuplicateSet}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p class="mb-4">No sets added</p>
      )}
    </div>
  );
};

export default EditableSetList;
