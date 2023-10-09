import { h } from 'preact';
import { useState, createContext, useContext } from 'preact/compat';
import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import { SimpleSet } from '../../types/types';

interface SessionState {
  plannedSet?: {
    [key: number]: SimpleSet[];
  };
  routine?: SimpleSet[];
}

interface SessionContext {
  sessionState: SessionState;
  plannedSets?: {
    [key: number]: SimpleSet[];
  };
  updatePlanedSet: (args: { id: number; sets: SimpleSet[] }) => void;
  getPlannedSets: (id: number) => SimpleSet[];
  startRoutine: (sets: SimpleSet[]) => void;
  activeRoutine: SimpleSet[] | undefined;
}

const SessionDataContext = createContext<SessionContext | null>(null);

export const SessionDataProvider = ({ children }) => {
  const [sessionState, setSessionState] = useState<SessionState>({});

  const updatePlanedSet = ({ id, sets }) => {
    const currentState = cloneDeep(sessionState);
    set(currentState, ['plannedSet', id], sets);
    setSessionState(currentState);
  };

  const getPlannedSets = (id) => sessionState?.plannedSet?.[id] || null;

  const startRoutine = (sets) => {
    setSessionState({
      ...sessionState,
      routine: sets,
    });
  };

  return (
    <SessionDataContext.Provider
      value={{
        sessionState,
        plannedSets: sessionState?.plannedSet || {},
        updatePlanedSet,
        getPlannedSets,
        startRoutine,
        activeRoutine: sessionState?.routine,
      }}
    >
      {children}
    </SessionDataContext.Provider>
  );
};
const useSessionContext = () => useContext(SessionDataContext);

export default useSessionContext;
