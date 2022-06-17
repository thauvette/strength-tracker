import { h } from "preact"
import LinkList from "../../../components/linkList/LinkList"
import { routes } from "../../../config/routes"

const GroupList = ({ groups }) => (
  <div>
    <LinkList
      links={groups.map(group => ({
        href: `${routes.newWorkout}/${encodeURI(group)}`,
        text: group,
      }))}
    />
  </div>
)

export default GroupList
