import { h } from 'preact';
import { useState } from 'preact/hooks';
import EditableSet from '../editableSet/editableSet.tsx';
import ExerciseSearch from '../exerciseSelection/ExerciseSearch';

const AuxExerciseForm = ({
  week,
  handleSubmit,
  initialValues,
  title,
  onCancel,
}) => {
  const [sets, setSets] = useState(
    initialValues?.sets || [{ reps: '', weight: '' }],
  );
  const [exercise, setExercise] = useState(initialValues?.exercise || null);

  const [addToAllWeeks, setAddToAllWeeks] = useState(true);

  const handleInput = ({ index, values }) => {
    const currentSets = [...sets];
    currentSets[index] = {
      ...currentSets[index],
      ...values,
    };
    setSets(currentSets);
  };

  const handleRemoveSet = (index) => {
    const currentSets = [...sets];

    if (currentSets[index]) {
      currentSets.splice(index, 1);
      setSets(currentSets);
    }
  };

  const addSet = () => {
    setSets([...sets, { reps: '', weight: '', isWarmUp: false }]);
  };

  const duplicateSet = (values) => {
    setSets([...sets, { ...values }]);
  };

  const save = () => {
    handleSubmit({ exercise, sets, addToAllWeeks });
  };

  return exercise?.id ? (
    <div>
      <div class="flex items-center justify-between">
        <h2>
          Adding to {title} {addToAllWeeks ? '' : `week ${week}`}
        </h2>
        <button onClick={onCancel}>X Cancel</button>
      </div>
      <label class="flex items-center">
        <input
          type="checkbox"
          class="mr-2"
          checked={addToAllWeeks}
          onInput={(e) => setAddToAllWeeks(e.target.checked)}
        />
        <p class="m-0">Add to all {title} days</p>
      </label>
      <p class="text-sm mb-2">*each week can be further customized</p>

      <div>
        <button onClick={() => setExercise(null)}>← Back</button>
        <h2 class="capitalize text-center">{exercise?.name}</h2>
      </div>

      {sets.map((setValues, index) => {
        return (
          <div key={index} class="border-b pb-6">
            <EditableSet
              handleChanges={({ reps, weight, isWarmUp }) => {
                handleInput({
                  index,
                  values: {
                    reps,
                    weight,
                    isWarmUp,
                  },
                });
              }}
              reps={setValues?.reps || ''}
              weight={setValues?.weight || ''}
              isWarmUp={!!setValues?.isWarmUp}
              handleRemove={(e) => {
                e.stopPropagation();
                handleRemoveSet(index);
              }}
              handleAddSet={addSet}
              title={`Set ${index + 1}`}
              onDuplicate={() => duplicateSet(setValues)}
              disablePlateModal
            />
          </div>
        );
      })}
      <div class="border-b py-2">
        <button class="blue" onClick={addSet}>
          + add set
        </button>
      </div>
      <div class="py-2">
        <button
          class="primary w-full"
          onClick={save}
          disabled={!exercise || !sets.length}
        >
          Save
        </button>
      </div>
    </div>
  ) : (
    <ExerciseSearch handleSelectExercise={setExercise} />
  );
};

export default AuxExerciseForm;
