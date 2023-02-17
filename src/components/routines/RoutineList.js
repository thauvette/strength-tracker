import { h } from 'preact'
import { Link } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'
import Icon from '../icon/Icon'
import { routes } from '../../config/routes'
import { objectStores } from '../../context/db/config'
import useDB from '../../context/db/db'

const RoutineList = ({ navigateToEdit }) => {
  const { getAllEntries, deleteEntry } = useDB()
  const [routines, setRoutines] = useState([])
  const deleteRoutine = (id) =>
    deleteEntry(objectStores.routines, id).then(() => getRoutines())

  const getRoutines = () => {
    getAllEntries(objectStores.routines).then((res) => {
      setRoutines(
        Object.entries(res || {}).map(([id, routine]) => ({
          id,
          ...routine,
        })),
      )
    })
  }

  useEffect(() => {
    getRoutines()
  }, []) // eslint-disable-line

  return (
    <div class="px-2">
      <div class="flex items-center justify-between">
        <h1>Routines</h1>
        <Link href={`${routes.routinesBase}/new`} class="">
          + New
        </Link>
      </div>

      <div class="pt-4">
        {routines?.length
          ? routines.map((routine) => (
              <div
                key={routine.id}
                class="flex items-center justify-between bg-1 border rounded-md p-4 mb-2"
              >
                <Link
                  class="block capitalize"
                  href={`${routes.routinesBase}/${routine.id}`}
                >
                  {routine.name || 'ROUTINE'}
                </Link>
                <div class="flex items-center gap-2">
                  <button onClick={() => navigateToEdit(routine)}>
                    <Icon name="create-outline" />
                  </button>
                  <button onClick={() => deleteRoutine(+routine.id)}>
                    <Icon name="trash-outline" />
                  </button>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

export default RoutineList
