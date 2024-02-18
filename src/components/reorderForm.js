import { h } from 'preact';
import { useState } from 'preact/hooks';
import EditableSetList from './EditableSetList';

const ReorderForm = ({
  items = [],
  onSave,
  allowEditAllWeeks,
  hideAllWeeksCheckbox,
}) => {
  const [sets, setSets] = useState(
    items.map((item, index) => ({
      ...item,
      exerciseName: item.exercise,
      exerciseId: item.primaryId,
      id: item.wendlerId,
      orignalIndex: index,
    })),
  );
  const [updateAllWeeks, setUpdateAllWeeks] = useState(allowEditAllWeeks);

  const submit = () => {
    onSave({
      newOrder: sets.map((set) => set.orignalIndex),
      updateAllWeeks,
      newSets: sets,
    });
  };

  return (
    <div>
      {!hideAllWeeksCheckbox && (
        <label class="flex items-center">
          <input
            type="checkbox"
            onInput={(e) => setUpdateAllWeeks(e.target.checked)}
            checked={updateAllWeeks}
            disabled={!allowEditAllWeeks}
          />
          <p class="m-0 ml-2 text-lg">Update all weeks?</p>
          {!allowEditAllWeeks && (
            <p>Unable to update all weeks, seems there are different sets.</p>
          )}
        </label>
      )}
      <EditableSetList sets={sets} setSets={setSets} />
      <div class="flex pt-4">
        <button class="w-full bg-primary-900 text-white" onClick={submit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ReorderForm;
