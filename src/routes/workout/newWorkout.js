import { h } from "preact"
import { route } from "preact-router"
import ExerciseSearch from "../../components/exerciseSelection/ExerciseSearch"
import { routes } from "../../config/routes"

const NewWorkout = () => {
  const handleSelectExercise = exercise =>
    route(`${routes.exerciseBase}/${exercise.id}`)

  return (
    <div class="h-full flex flex-col">
      <ExerciseSearch handleSelectExercise={handleSelectExercise} />
    </div>
  )
}

export default NewWorkout
