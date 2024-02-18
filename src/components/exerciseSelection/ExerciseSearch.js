import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ExerciseForm from '../exerciseForm/ExerciseForm';

import useDB from '../../context/db/db.tsx';
import ExercisesByGroup from './ExercisesByGroup';
import ExerciseSelection from './ExerciseSelection';

const ExerciseSearch = ({ handleSelectExercise }) => {
  const { getExerciseOptions } = useDB();
  const [exerciseOptions, setExerciseOptions] = useState({});
  const [showNewExerciseForm, setShowNewExerciseForm] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [activeGroupId, setActiveGroupId] = useState('');

  const activeGroup = activeGroupId
    ? exerciseOptions[activeGroupId]?.items
    : null;

  const getOptions = () => {
    getExerciseOptions().then((res) => {
      const startedExercises = Object.values(res || {}).reduce((arr, group) => {
        group?.items?.forEach((item) => {
          if (item.isFavorite) {
            arr.push(item);
          }
        });
        return arr;
      }, []);
      const result = {
        ...res,
      };
      if (startedExercises?.length) {
        result.starred = {
          name: 'Favorites',
          items: startedExercises,
          id: 'starred',
        };
      }
      setExerciseOptions(result);
    });
  };

  useEffect(() => {
    getOptions();
  }, []); // eslint-disable-line
  if (!exerciseOptions) {
    return null;
  }
  const renderComponents = () => {
    if (showNewExerciseForm) {
      return (
        <ExerciseForm
          onSubmit={(res) => {
            handleSelectExercise(res);
          }}
          initialValues={{
            name: searchText,
          }}
          title="Add Exercise"
        />
      );
    }
    if (!activeGroup) {
      return (
        <ExerciseSelection
          allExercises={exerciseOptions}
          handleSelectExercise={handleSelectExercise}
          handleSelectGroup={(id) => setActiveGroupId(id)}
          searchText={searchText}
        />
      );
    }
    return (
      <ExercisesByGroup
        group={activeGroup}
        searchText={searchText}
        handleSelectExercise={handleSelectExercise}
      />
    );
  };

  return (
    <div class="h-full flex flex-col">
      {(showNewExerciseForm || !!activeGroup) && (
        <div>
          <button
            onClick={() => {
              setActiveGroupId('');
              setShowNewExerciseForm(false);
            }}
          >
            ← Back
          </button>
        </div>
      )}
      <div class="p-2 pb-4 border-b-4 flex items-end justify-between">
        {showNewExerciseForm ? null : (
          <>
            <label>
              <p>Search</p>
              <input
                onInput={(e) => setSearchText(e.target.value)}
                value={searchText}
                onFocus={(e) => {
                  e.target.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              />
            </label>
            <div class="pb-1">
              <button class="blue" onClick={() => setShowNewExerciseForm(true)}>
                New +
              </button>
            </div>
          </>
        )}
      </div>
      <div class="flex-grow">{renderComponents()}</div>
    </div>
  );
};

export default ExerciseSearch;
