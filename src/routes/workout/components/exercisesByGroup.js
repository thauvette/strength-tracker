import { h } from "preact"
import { Link } from "preact-router"
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
    <div>
      {matches.map(exercise => (
        <div key={exercise.id}>
          <Link href={`${routes.exerciseBase}/${exercise.id}`}>
            {exercise.name}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default ExercisesByGroup
