import { h } from 'preact';
import ButtonList from '../buttonList/ButtonList';

const ExercisesByGroup = ({ searchText, handleSelectExercise, group }) => {
  const matches = group.filter(
    (exercise) =>
      !searchText ||
      exercise.name?.toLowerCase()?.includes(searchText?.toLowerCase()),
  );

  return (
    <div>
      <ButtonList
        buttons={matches.map((exercise) => ({
          onClick: () => handleSelectExercise(exercise),
          text: exercise.name,
        }))}
      />
    </div>
  );
};

export default ExercisesByGroup;
