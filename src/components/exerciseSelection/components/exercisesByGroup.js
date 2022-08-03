import { h } from "preact"
import ButtonList from "../../buttonList/ButtonList"

const ExercisesByGroup = ({
  allExerciseOptions,
  name,
  searchText,
  handleSelectExercise,
}) => {
  const matches = allExerciseOptions.filter(
    option =>
      option.primaryGroup === name &&
      (!searchText ||
        option.name?.toLowerCase()?.includes(searchText?.toLowerCase()))
  )

  return (
    <div>
      <ButtonList
        buttons={matches.map(exercise => ({
          onClick: () => handleSelectExercise(exercise),
          text: exercise.name,
        }))}
      />
    </div>
  )
}

export default ExercisesByGroup
