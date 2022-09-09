import { h } from 'preact'
import ButtonList from '../../buttonList/ButtonList'
import GroupList from './groupList'

const ExerciseSelection = ({
  allExercises,
  groups,
  searchText,
  handleSelectGroup,
  handleSelectExercise,
}) => (
  <div>
    <div>
      {searchText?.length ? (
        <ButtonList
          buttons={allExercises
            .filter((exercise) =>
              exercise.name?.toLowerCase()?.includes(searchText?.toLowerCase()),
            )
            .map((exercise) => ({
              onClick: () => handleSelectExercise(exercise),
              text: exercise.name,
            }))}
        />
      ) : (
        <GroupList groups={groups} handleSelectGroup={handleSelectGroup} />
      )}
    </div>
  </div>
)

export default ExerciseSelection
