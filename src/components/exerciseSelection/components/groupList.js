import { h } from 'preact'
import ButtonList from '../../buttonList/ButtonList'

const GroupList = ({ groups, handleSelectGroup }) => (
  <div>
    <ButtonList
      buttons={groups.map((group) => ({
        onClick: () => handleSelectGroup(group),
        text: group,
      }))}
    />
  </div>
)

export default GroupList
