import { h } from 'preact'
import { uniqBy } from 'lodash'
import ButtonList from '../buttonList/ButtonList'
import GroupList from './GroupList'

const ExerciseSelection = ({
  allExercises,
  handleSelectExercise,
  handleSelectGroup,
  searchText,
}) => {
  const searchMatches = searchText?.length
    ? Object.values(allExercises).reduce((arr, group) => {
        group?.items.forEach((item) => {
          if (item.name?.toLowerCase()?.includes(searchText?.toLowerCase())) {
            arr.push(item)
          }
        })
        return arr
      }, [])
    : []

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
  )
}

export default ExerciseSelection
