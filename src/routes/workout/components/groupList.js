import { h } from "preact"
import { Link } from "preact-router"
import { routes } from "../../../config/routes"

const GroupList = ({ groups }) => (
  <div>
    {groups.map(group => (
      <div key={group}>
        <Link href={`${routes.newWorkout}/${encodeURI(group)}`}>{group}</Link>
      </div>
    ))}
  </div>
)

export default GroupList
