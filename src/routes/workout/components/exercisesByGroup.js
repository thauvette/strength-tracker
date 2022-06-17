import { h } from "preact"

import LinkList from "../../../components/linkList/LinkList"
import { routes } from "../../../config/routes"

const ExercisesByGroup = props => {
  const {
    allExerciseOptions,
    matches: { name },
  } = props

  const groupName = decodeURI(name)
  const matches = allExerciseOptions.filter(
    option => option.primaryGroup === groupName
  )

  return (
    <LinkList
      links={matches.map(exercise => ({
        href: `${routes.exerciseBase}/${exercise.id}`,
        text: exercise.name,
      }))}
    />
  )
}

export default ExercisesByGroup

/**
 *
 *  <div>
      {matches.map(exercise => (
        <div key={exercise.id}>
          <Link href={`${routes.exerciseBase}/${exercise.id}`}>
            {exercise.name}
          </Link>
        </div>
      ))}
    </div>
 *
 */
