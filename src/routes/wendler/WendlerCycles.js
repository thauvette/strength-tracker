import { h } from "preact"
import { Link, route } from "preact-router"
import { useState, useEffect } from "preact/hooks"
import { routes } from "../../config/routes"

import useDB, { objectStores } from "../../context/db"

import deleteIcon from "../../assets/icons/close-circle-outline.svg"

export default function WendlerCycles() {
  const { getAllEntries, deleteEntry } = useDB()
  const [workouts, setWorkouts] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllEntries(objectStores.wendlerCycles)
      .then(res => {
        setWorkouts(res)
      })
      .catch(err => {
        setError(err?.message || "something is wrong")
      })
  }, [getAllEntries])

  const handleDelete = id => {
    deleteEntry(objectStores.wendlerCycles, id).then(res => setWorkouts(res))
  }

  return (
    <div class="pb-3 px-2 h-full flex flex-col">
      <div class="pt-6 flex-1">
        {error && <p>{error}</p>}
        <div class="flex justify-between">
          <h3>Wendler Cycles</h3>
          <Link href={routes.wendlerNew}>Create+</Link>
        </div>

        {workouts &&
          Object.keys(workouts)?.length > 0 &&
          Object.entries(workouts)
            .sort(([aKey, a], [bKey, b]) => (a.created > b.created ? -1 : 1))
            .map(([id, data]) => (
              <div
                key={id}
                className="border-b border-gray-400 flex justify-between align-center py-4"
              >
                <Link href={`${routes.wendlerBase}/${id}`}>
                  {data?.title} - {data.description}
                </Link>
                <div>
                  <button
                    class="p-0 leading-none color-red-900"
                    onClick={() => handleDelete(id)}
                  >
                    <img class="w-8 h-8" src={deleteIcon} alt="delete" />
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
