import cloneDeep from 'lodash.clonedeep'
import set from 'lodash.set'
import { h } from 'preact'
import { useState, createContext, useContext } from 'preact/compat'

const SessionDataContext = createContext()

export const SessionDataProvider = ({ children }) => {
  const [sessionState, setSessionState] = useState({})

  const updatePlanedSet = ({ id, sets }) => {
    const currentState = cloneDeep(sessionState)
    set(currentState, ['plannedSet', id], sets)
    setSessionState(currentState)
  }

  const getPlannedSets = (id) => sessionState?.plannedSet?.[id] || null

  const startRoutine = (sets) => {
    setSessionState({
      ...sessionState,
      routine: sets,
    })
  }

  return (
    <SessionDataContext.Provider
      value={{
        sessionState,
        updatePlanedSet,
        getPlannedSets,
        startRoutine,
        activeRoutine: sessionState?.routine,
      }}
    >
      {children}
    </SessionDataContext.Provider>
  )
}
const useSessionContext = () => useContext(SessionDataContext)

export default useSessionContext
