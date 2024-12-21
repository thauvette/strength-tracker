import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import ExerciseForm from '../exerciseForm/ExerciseForm';

import useDB from '../../context/db/db';
import ExercisesByGroup from './ExercisesByGroup.js';
import ExerciseSelection from './ExerciseSelection.js';
import { Exercise } from '../../context/db/types';

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
      const favoriteExercises = Object.values(res || {}).reduce(
        (arr, group) => {
          group?.items?.forEach((item) => {
            if (item.isFavorite) {
              arr.push(item);
            }
          });
          return arr;
        },
        [],
      );
      const result: {
        [p: string]: {
          name: string;
          items: Exercise[];
          id: number | string;
        };
      } = {
        ...res,
      };
      if (favoriteExercises?.length) {
        result.starred = {
          name: 'Favorites',
          items: favoriteExercises,
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
          handleSelectGroup={(id: string) => setActiveGroupId(id)}
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
                onInput={(event) => {
                  if (event.target instanceof HTMLInputElement) {
                    setSearchText(event.target.value);
                  }
                }}
                value={searchText}
                onFocus={(event) => {
                  if (event.target instanceof HTMLElement) {
                    event.target.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }
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
