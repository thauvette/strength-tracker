import { h } from "preact"
import { Link } from "preact-router"
import { LOCAL_STORAGE_WORKOUT_KEY } from "../../config/constants"

import style from "./home.scss"

export default function Home() {
  const workouts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_WORKOUT_KEY))

  return (
    <div class={style.home}>
      <div class={style.header}>
        <p>Workouts</p>
        <Link href="/new">Add New +</Link>
      </div>
      {workouts &&
        Object.keys(workouts)?.length > 0 &&
        Object.entries(workouts).map(([dateTime, data]) => {
          return (
            <div key={dateTime}>
              <Link href={`/workout/${dateTime}`}>
                {data?.title || Date(dateTime)} - {data.description}
              </Link>
            </div>
          )
        })}
    </div>
  )
}
