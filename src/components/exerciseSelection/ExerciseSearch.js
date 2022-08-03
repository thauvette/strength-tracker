import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import ExerciseForm from "../exerciseForm"

import useDB from "../../context/db"
import ExercisesByGroup from "./components/exercisesByGroup"
import ExerciseSelection from "./components/exerciseSelection"

const ExerciseSearch = ({ handleSelectExercise }) => {
  const { getExerciseOptions } = useDB()
  const [exerciseOptions, setExerciseOptions] = useState([])
  const [primaryGroups, setPrimaryGroups] = useState([])
  const [showNewExerciseForm, setShowNewExerciseForm] = useState(false)
  const [searchText, setSearchText] = useState("")

  const [activeGroup, setActiveGroup] = useState("")

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

  const renderComponents = () => {
    if (showNewExerciseForm) {
      return (
        <ExerciseForm
          onSubmit={() => {
            getOptions()
            setShowNewExerciseForm(false)
          }}
        />
      )
    }
    if (!activeGroup) {
      return (
        <ExerciseSelection
          handleSelectGroup={group => setActiveGroup(group)}
          handleSelectExercise={handleSelectExercise}
          groups={primaryGroups}
          allExercises={exerciseOptions}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      )
    }
    return (
      <>
        <div>
          <button onClick={() => setActiveGroup("")}>← Back</button>
        </div>
        <ExercisesByGroup
          name={activeGroup}
          allExerciseOptions={exerciseOptions}
          searchText={searchText}
          handleSelectExercise={handleSelectExercise}
        />
      </>
    )
  }

  return (
    <div class="h-full flex flex-col">
      <div class="p-2 pb-4 border-b-4 flex items-end justify-between">
        {showNewExerciseForm ? (
          <div>
            <button onClick={() => setShowNewExerciseForm(false)}>
              ← Back
            </button>
          </div>
        ) : (
          <>
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
                onClick={() => setShowNewExerciseForm(true)}
              >
                New +
              </button>
            </div>
          </>
        )}
      </div>
      <div class="flex-grow">{renderComponents()}</div>
    </div>
  )
}

export default ExerciseSearch
