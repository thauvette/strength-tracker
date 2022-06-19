import { h } from "preact"
import Router from "preact-router"
import { useState, useEffect } from "preact/hooks"
import ExerciseForm from "../../components/exerciseForm"
import Modal from "../../components/modal/Modal"
import { routes } from "../../config/routes"

import useDB from "../../context/db"
import ExercisesByGroup from "./components/exercisesByGroup"
import ExerciseSelection from "./components/exerciseSelection"

const NewWorkout = () => {
  const { getExerciseOptions } = useDB()
  const [exerciseOptions, setExerciseOptions] = useState([])
  const [primaryGroups, setPrimaryGroups] = useState([])
  const [newExerciseModalIsOpen, setNewExerciseModalIsOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  const getOptions = () => {
    getExerciseOptions().then(res => {
      setExerciseOptions(res)
      const groups = res.map(item => item.primaryGroup).filter(item => !!item)
      setPrimaryGroups(Array.from(new Set(groups)))
    })
  }

  useEffect(() => {
    getOptions()
  }, []) // eslint-disable-line

  return (
    <div class="h-full flex flex-col">
      <div class="p-2 pb-4 border-b-4 flex items-end justify-between">
        <label>
          <p>Search</p>
          <input
            onInput={e => setSearchText(e.target.value)}
            value={searchText}
          />
        </label>
        <div class="pb-1">
          <button
            class="bg-blue-200"
            onClick={() => setNewExerciseModalIsOpen(true)}
          >
            New +
          </button>
        </div>
      </div>
      <div class="flex-grow">
        <Router>
          <ExerciseSelection
            path={routes.newWorkout}
            groups={primaryGroups}
            allExercises={exerciseOptions}
            searchText={searchText}
            setSearchText={setSearchText}
          />
          <ExercisesByGroup
            path={`${routes.newWorkout}/:name`}
            allExerciseOptions={exerciseOptions}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </Router>
      </div>
      <Modal
        isOpen={newExerciseModalIsOpen}
        onRequestClose={() => setNewExerciseModalIsOpen(false)}
      >
        <ExerciseForm
          onSubmit={() => {
            getOptions()
            setNewExerciseModalIsOpen(false)
          }}
        />
      </Modal>
    </div>
  )
}

export default NewWorkout
