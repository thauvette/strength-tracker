import { h } from "preact"
import Router from "preact-router"
import { useState, useEffect } from "preact/hooks"
import { routes } from "../../config/routes"

import useDB from "../../context/db"
import ExercisesByGroup from "./components/exercisesByGroup"
import GroupList from "./components/groupList"

const NewWorkout = () => {
  const { getExerciseOptions } = useDB()
  const [exerciseOptions, setExerciseOptions] = useState([])
  const [primaryGroups, setPrimaryGroups] = useState([])

  useEffect(() => {
    getExerciseOptions().then(res => {
      setExerciseOptions(res)
      const groups = res.map(item => item.primaryGroup).filter(item => !!item)
      setPrimaryGroups(Array.from(new Set(groups)))
    })
  }, []) // eslint-disable-line

  return (
    <div>
      <Router>
        <GroupList path={routes.newWorkout} groups={primaryGroups} />
        <ExercisesByGroup
          path={`${routes.newWorkout}/:name`}
          allExerciseOptions={exerciseOptions}
        />
      </Router>
    </div>
  )
}

export default NewWorkout
