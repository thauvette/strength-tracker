import { h } from "preact"
import { Link } from "preact-router"
import { useState, useEffect } from "preact/hooks"

import useDB, { objectStores } from "../../context/db"

export default function Home() {
  const { getAllEntries, deleteEntry } = useDB()
  const [workouts, setWorkouts] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    getAllEntries(objectStores.wendlerCycles)
      .then(res => {
        setWorkouts(res)
      })
      .catch(err => {
        setError(err?.message || "something is borked")
      })
  }, [getAllEntries])

  const handleDelete = id => {
    deleteEntry(objectStores.wendlerCycles, id).then(res => setWorkouts(res))
  }

  return (
    <div class="pb-3 px-2">
      {error && <p>{error}</p>}
      <div class="pt-6">
        <div class="flex justify-between">
          <h3>Wendler Cycles</h3>
          <Link href="/new-wendler">Create+</Link>
        </div>

        {workouts &&
          Object.keys(workouts)?.length > 0 &&
          Object.entries(workouts).map(([id, data]) => (
            <div
              key={id}
              className="border-b border-gray-400 flex justify-between align-center py-4"
            >
              <Link href={`/wendler/${id}`}>
                {data?.title} - {data.description}
              </Link>
              <div>
                <button
                  class="border border-red-900 rounded-full w-8 h-8 p-0 leading-none color-red-900"
                  onClick={() => handleDelete(id)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
