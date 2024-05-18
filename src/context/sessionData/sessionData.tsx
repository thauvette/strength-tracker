import { h } from 'preact';
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from 'preact/compat';
import { SimpleSet } from '../../types/types';
import useToast from '../toasts/Toasts';

interface SessionState {
  plannedSet?: {
    [key: number]: SimpleSet[];
  };
  routine?: SimpleSet[];
}

interface SessionContext {
  activeRoutine: SimpleSet[] | undefined;
  addToRoutine: (sets: SimpleSet[]) => void;
  getPlannedSets: (id: number) => SimpleSet[];
  hasActiveRoutine: boolean;
  startRoutine: (sets: SimpleSet[]) => void;
  updatePlanedSets: (args: { id: number; sets: SimpleSet[] }) => void;
}

const SessionDataContext = createContext<SessionContext | null>(null);

export const SessionDataProvider = ({ children }) => {
  const { fireToast } = useToast();
  const [sessionState, setSessionState] = useState<SessionState>({});

  const updatePlanedSets = useCallback(({ id, sets }) => {
    setSessionState((current) => ({
      ...current,
      plannedSet: {
        ...(current.plannedSet || {}),
        [id]: sets,
      },
    }));
  }, []);

  const getPlannedSets = useCallback(
    (id: number) => sessionState?.plannedSet?.[id] || null,
    [sessionState?.plannedSet],
  );

  const startRoutine = useCallback((sets: SimpleSet[]) => {
    setSessionState((current) => ({
      ...current,
      routine: sets,
    }));
  }, []);

  const addToRoutine = useCallback(
    (sets: SimpleSet[]) => {
      setSessionState((current) => ({
        ...current,
        routine: [...(current?.routine || []), ...sets],
      }));
      fireToast({ text: `${sets?.length || 0} sets added to today's routine` });
    },
    [fireToast],
  );

  const activeRoutine = useMemo(
    () => sessionState?.routine,
    [sessionState?.routine],
  );

  return (
    <SessionDataContext.Provider
      value={{
        activeRoutine,
        addToRoutine,
        getPlannedSets,
        hasActiveRoutine: !!activeRoutine,
        startRoutine,
        updatePlanedSets,
      }}
    >
      {children}
    </SessionDataContext.Provider>
  );
};
const useSessionContext = () => {
  const context = useContext(SessionDataContext);
  if (!context) {
    throw new Error(
      'useSessionContext must be inside SessionDataContextProvider',
    );
  }
  return context;
};

export default useSessionContext;
