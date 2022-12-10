import { h } from 'preact'
import { route } from 'preact-router'

import { routes } from '../config/routes'
import ExerciseSearch from './exerciseSelection/ExerciseSearch'

const ExerciseSearchMenu = ({ isOpen, closeExerciseSearch }) => {
  const handleSelectExercise = (exercise) => {
    closeExerciseSearch()
    route(`${routes.exerciseBase}/${exercise.id}`)
  }

  return (
    <div
      class={`fixed inset-0 bg-white transform pt-16 transition-transform z-10 ${
        isOpen ? '' : '-translate-y-full'
      }`}
    >
      <ExerciseSearch handleSelectExercise={handleSelectExercise} />
    </div>
  )
}

export default ExerciseSearchMenu
