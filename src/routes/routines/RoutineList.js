import { h } from 'preact'
import { Link } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'
import Icon from '../../components/icon/Icon'
import { routes } from '../../config/routes'
import { objectStores } from '../../context/db/config'
import useDB from '../../context/db/db'

const RoutineList = () => {
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
                class="flex items-center justify-between bg-white border rounded-md p-4 mb-2"
              >
                <Link
                  class="block capitalize"
                  href={`${routes.routinesBase}/${routine.id}`}
                >
                  {routine.name || 'ROUTINE'}
                </Link>
                <button onClick={() => deleteRoutine(+routine.id)}>
                  <Icon name="trash-outline" />
                </button>
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

export default RoutineList
