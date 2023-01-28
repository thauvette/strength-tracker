import { h } from 'preact'
import ButtonList from '../buttonList/ButtonList'

const GroupList = ({ allExercises, handleSelectGroup }) => (
  <div>
    <ButtonList
      buttons={Object.entries(allExercises || {})
        .sort((a) => (a[0] === 'starred' ? -1 : 1))
        .map(([id, group]) => ({
          onClick: () => handleSelectGroup(id),
          text: group.name,
        }))}
    />
  </div>
)

export default GroupList
