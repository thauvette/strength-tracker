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

  return (
    <SessionDataContext.Provider
      value={{ sessionState, updatePlanedSet, getPlannedSets }}
    >
      {children}
    </SessionDataContext.Provider>
  )
}
const useSessionContext = () => useContext(SessionDataContext)

export default useSessionContext
