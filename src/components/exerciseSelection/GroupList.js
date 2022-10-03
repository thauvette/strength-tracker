import { h } from 'preact'
import ButtonList from '../../buttonList/ButtonList'

const GroupList = ({ allExercises, handleSelectGroup }) => (
  <div>
    <ButtonList
      buttons={Object.entries(allExercises || {}).map(([id, group]) => ({
        onClick: () => handleSelectGroup(id),
        text: group.name,
      }))}
    />
  </div>
)

export default GroupList
