import { h } from 'preact';
import { uniqBy } from 'lodash';
import ButtonList from '../buttonList/ButtonList';
import GroupList from './GroupList';
import { useMemo } from 'preact/hooks';

const ExerciseSelection = ({
  allExercises,
  handleSelectExercise,
  handleSelectGroup,
  searchText,
}) => {
  const searchMatches = useMemo(
    () =>
      searchText?.length
        ? Object.values(allExercises).reduce((arr, group) => {
            group?.items.forEach((item) => {
              if (
                item.name?.toLowerCase()?.includes(searchText?.toLowerCase())
              ) {
                arr.push(item);
                return arr;
              }
              const nameChunks = item.name.split(' ');
              const terms = searchText.split(' ');
              // every term is included in some nameChuck
              const match = terms.every((term) =>
                nameChunks.some((chunk) =>
                  chunk.toLowerCase().includes(term.toLowerCase()),
                ),
              );

              if (match) {
                arr.push(item);
              }
            });
            return arr;
          }, [])
        : [],
    [searchText, allExercises],
  );

  return searchText?.length ? (
    <ButtonList
      buttons={uniqBy(searchMatches, 'id').map((exercise) => ({
        onClick: () => handleSelectExercise(exercise),
        text: exercise.name,
      }))}
    />
  ) : (
    <GroupList
      allExercises={allExercises}
      handleSelectGroup={handleSelectGroup}
    />
  );
};

export default ExerciseSelection;
