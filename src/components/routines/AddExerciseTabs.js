import { h } from 'preact';
import dayjs from 'dayjs';
import { useState } from 'preact/hooks';
import ExerciseStats from '../exerciseStats/ExerciseStats';
import Plan from '../Plan';
import EditableSet from '../editableSet/editableSet.tsx';
import generateRandomId from '../../utilities.js/generateRandomId';
import Icon from '../icon/Icon.js';
import EditableSetList from '../EditableSetList.tsx';

const AddExerciseTabs = ({
  selectedExercise,
  addedSets,
  setAddedSets,
  submit,
  addFromHistroy,
}) => {
  const [view, setView] = useState('add');

  const views = {
    add: (
      <div>
        <EditableSet
          reps={addedSets?.[addedSets?.length - 1]?.reps || 0}
          weight={addedSets?.[addedSets?.length - 1]?.weight || 0}
          isWarmUp={!!addedSets?.[addedSets?.length - 1]?.weight}
          renderCtas={({ weight, reps, isWarmUp }) => {
            return (
              <button
                class="bg-primary-900 text-white w-full"
                onClick={() =>
                  setAddedSets([
                    ...addedSets,
                    {
                      weight,
                      reps,
                      isWarmUp,
                      id: generateRandomId(),
                      exerciseId: selectedExercise.id,
                      exerciseName: selectedExercise.name,
                      musclesWorked: selectedExercise.musclesWorked,
                      secondaryMusclesWorked:
                        selectedExercise.secondaryMusclesWorked,
                    },
                  ])
                }
              >
                + Add Set
              </button>
            );
          }}
          disablePlateModal
        />
      </div>
    ),
    templates: (
      <div>
        {selectedExercise?.lastWorkoutHeaviestSet && (
          <p class="font-bold">
            Last heavy set: {selectedExercise?.lastWorkoutHeaviestSet?.reps}
            {' @ '}
            {selectedExercise?.lastWorkoutHeaviestSet?.weight}
            {' - '}
            {dayjs(selectedExercise?.lastWorkoutHeaviestSet?.created).format(
              'MMM DD YYYY',
            )}
          </p>
        )}
        <Plan
          initialWeight={selectedExercise?.lastWorkoutHeaviestSet?.weight}
          updatePlanedSet={(newSets) =>
            setAddedSets([
              ...addedSets,
              ...newSets.map((set) => ({
                ...set,
                id: generateRandomId(),
                exerciseId: selectedExercise.id,
                exerciseName: selectedExercise.name,
                musclesWorked: selectedExercise.musclesWorked,
                secondaryMusclesWorked: selectedExercise.secondaryMusclesWorked,
              })),
            ])
          }
          submitText="Add To Sets"
        />
      </div>
    ),
    history: (
      <div>
        <ExerciseStats
          exerciseHistory={selectedExercise}
          updatePlanedSet={(newSets) => {
            addFromHistroy(
              newSets.map((set) => ({
                ...set,
                exerciseId: +selectedExercise.id,
                exerciseName: selectedExercise.name,
                musclesWorked: selectedExercise.musclesWorked,
                secondaryMusclesWorked: selectedExercise.secondaryMusclesWorked,
              })),
            );
          }}
          reuseCta="Add Sets"
        />
      </div>
    ),
  };

  return (
    <>
      <div class="w-full overflow-y-hidden py-4 ">
        {addedSets?.length ? (
          <div class="pt-4 pb-2 border-b mb-4">
            <p>Added sets:</p>
            <EditableSetList sets={addedSets} setSets={setAddedSets} />
            <button onClick={submit} class="w-full primary my-4">
              <div class="flex items-center justify-center">
                <Icon name="save-outline" />
                <p class="ml-1">Save Sets</p>
              </div>
            </button>
          </div>
        ) : null}
        <div class="flex overscroll-x-auto">
          <button
            class={`px-2 py-1 text-xs bg-blue-100 text-gray-800 border-0 border-b-2 border-blue-900 rounded-none ${
              view === 'add' ? ' border-opacity-1' : 'border-opacity-0 '
            }`}
            onClick={() => setView('add')}
          >
            Custom
          </button>
          <button
            class={`px-2 py-1 text-xs bg-blue-100 text-gray-800 border-0 border-b-2 border-blue-900 rounded-none ${
              view === 'templates' ? ' border-opacity-1' : 'border-opacity-0 '
            }`}
            onClick={() => setView('templates')}
          >
            Templates
          </button>

          <button
            class={`px-2 py-1 text-xs bg-blue-100 text-gray-800 border-0 border-b-2 border-blue-900 rounded-none ${
              view === 'history' ? ' border-opacity-1' : 'border-opacity-0 '
            }`}
            onClick={() => setView('history')}
          >
            History
          </button>
        </div>
      </div>
      <div class="pb-4">{views[view]}</div>
    </>
  );
};

export default AddExerciseTabs;
