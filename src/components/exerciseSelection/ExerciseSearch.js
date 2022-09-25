import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import ExerciseForm from '../ExerciseForm'

import useDB from '../../context/db/db'
import ExercisesByGroup from './components/exercisesByGroup'
import ExerciseSelection from './components/exerciseSelection'

const ExerciseSearch = ({ handleSelectExercise }) => {
  const { getExerciseOptions } = useDB()
  const [exerciseOptions, setExerciseOptions] = useState([])
  const [showNewExerciseForm, setShowNewExerciseForm] = useState(false)
  const [searchText, setSearchText] = useState('')

  const [activeGroupId, setActiveGroupId] = useState('')

  const activeGroup = activeGroupId
    ? exerciseOptions[activeGroupId]?.items
    : null

  const getOptions = () => {
    getExerciseOptions().then((res) => {
      setExerciseOptions(res)
    })
  }

  useEffect(() => {
    getOptions()
  }, []) // eslint-disable-line
  if (!exerciseOptions) {
    return null
  }
  const renderComponents = () => {
    if (showNewExerciseForm) {
      return (
        <ExerciseForm
          onSubmit={() => {
            getOptions()
            setShowNewExerciseForm(false)
          }}
          initialNameValue={searchText}
        />
      )
    }
    if (!activeGroup) {
      return (
        <ExerciseSelection
          allExercises={exerciseOptions}
          handleSelectExercise={handleSelectExercise}
          handleSelectGroup={(id) => setActiveGroupId(id)}
          searchText={searchText}
        />
      )
    }
    return (
      <>
        <div>
          <button onClick={() => setActiveGroupId('')}>← Back</button>
        </div>
        <ExercisesByGroup
          group={activeGroup}
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
              ← Return
            </button>
          </div>
        ) : (
          <>
            <label>
              <p>Search</p>
              <input
                onInput={(e) => setSearchText(e.target.value)}
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
