import { h } from "preact"
import { Link } from "preact-router"
import { useState, useEffect } from "preact/hooks"

import useDB from "../../context/db"

import style from "./home.scss"

export default function Home() {
  const { getAllEntries, deleteEntry } = useDB()
  const [workouts, setWorkouts] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    getAllEntries()
      .then(res => {
        setWorkouts(res)
      })
      .catch(err => {
        setError(err?.message || "something is borked")
      })
  }, [getAllEntries])

  const handleDelete = id => {
    deleteEntry(id).then(res => setWorkouts(res))
  }

  return (
    <div class={style.home}>
      <div class={style.header}>
        <p>Workouts</p>
        <Link href="/new-wendler">New Wendler+</Link>
      </div>
      {error && <p>{error}</p>}
      {workouts &&
        Object.keys(workouts)?.length > 0 &&
        Object.entries(workouts).map(([id, data]) => {
          return (
            <div key={id} className="border-b border-gray-400">
              <Link href={`/workout/${id}`}>
                {data?.title} - {data.description}
              </Link>
              <div>
                <button onClick={() => handleDelete(id)}>delete</button>
              </div>
            </div>
          )
        })}
    </div>
  )
}
