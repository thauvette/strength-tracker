import { h } from 'preact'
import useSessionContext from '../../context/sessionData/sessionData'
import PlannedWorkout from '../exercise/PlannedWorkout'
import useDB from '../../context/db/db'

// TODO: - freeForm sets
// TODO - UX all the way through from creating routines
const ActiveRoutine = () => {
  const { activeRoutine, startRoutine } = useSessionContext()
  const { createOrUpdateLoggedSet } = useDB()

  const onUpdateSet = (set, index) => {
    createOrUpdateLoggedSet(set.id, {
      weight: set.weight,
      reps: set.reps,
      exercise: set.exercise,
    }).then((res) => {
      // add the id to the matching set
      const currentSets = [...activeRoutine]

      currentSets[index] = {
        ...res,
        exerciseName: set.exerciseName,
      }
      startRoutine(currentSets)
    })
  }

  if (!activeRoutine?.length) {
    return <p>No active routine</p>
  }
  return <PlannedWorkout sets={activeRoutine} onUpdateSet={onUpdateSet} />
}

export default ActiveRoutine
