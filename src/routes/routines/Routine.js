import { h } from 'preact'
import { route } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'
import Accordion from '../../components/accordion/accordion'
import { routes } from '../../config/routes'
import { objectStores } from '../../context/db/config'
import useDB from '../../context/db/db'
import useSessionContext from '../../context/sessionData/sessionData'

const Routine = ({ id }) => {
  const [routine, setRoutine] = useState(null)
  const [error, setError] = useState(null)
  const { getItem } = useDB()
  const { startRoutine } = useSessionContext()

  const getRoutine = () => {
    getItem(objectStores.routines, id)
      .then((res) => {
        setRoutine(res)
      })
      .catch((err) => setError(err))
  }

  useEffect(() => {
    getRoutine()
  }, []) // eslint-disable-line

  const setActiveRoutine = (sets) => {
    startRoutine(sets)
    route(routes.activeRoutine)
  }

  if (!routine && !error) {
    return null
  }
  if (error) {
    return <p>{error}</p>
  }
  return (
    <div>
      <h1 class="capitalize mb-4">{routine.name}</h1>
      {routine.days?.length
        ? routine.days.map((day, i) => {
            return (
              <div key={i} class="bg-white border rounded-md mb-4">
                <Accordion title={day.name} titleClass="font-bold">
                  <div class="px-4 pt-2 pb-4">
                    {day.sets?.length
                      ? day.sets.map((set, setIndex) => (
                          <p key={setIndex}>
                            {set.exerciseName} -{' '}
                            {set.freeForm ? (
                              'free form'
                            ) : (
                              <>
                                {set.reps} @ {set.weight}
                              </>
                            )}
                          </p>
                        ))
                      : null}
                    <button
                      class="bg-blue-900 text-white mt-8"
                      onClick={() => setActiveRoutine(day.sets)}
                    >
                      Start Workout
                    </button>
                  </div>
                </Accordion>
              </div>
            )
          })
        : null}
    </div>
  )
}

export default Routine
