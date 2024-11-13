import { h } from 'preact';
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from 'preact/compat';
import useToast from '../toasts/Toasts';

interface SessionState {
  plannedSet?: {
    [key: number]: RoutineSet[];
  };
  routine?: RoutineSet[];
}

interface SessionContext {
  activeRoutine: RoutineSet[] | undefined;
  addToRoutine: (sets: RoutineSet[]) => void;
  getPlannedSets: (id: number) => RoutineSet[];
  hasActiveRoutine: boolean;
  startRoutine: (sets: RoutineSet[]) => void;
  updatePlanedSet: (set: RoutineSet, index: number) => void;
  updatePlanedSets: (args: { id: number; sets: RoutineSet[] }) => void;
}

export interface RoutineSet {
  barWeight?: number;
  exercise: number;
  exerciseName: string;
  isWarmUp: boolean;
  reps: number;
  weight: number;
  created?: number;
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

  const startRoutine = useCallback((sets: RoutineSet[]) => {
    setSessionState((current) => ({
      ...current,
      routine: sets,
    }));
  }, []);

  const addToRoutine = useCallback(
    (sets: RoutineSet[]) => {
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

  const updatePlanedSet = useCallback((set: RoutineSet, index: number) => {
    setSessionState((prevState) => ({
      ...prevState,
      routine:
        prevState?.routine?.map((currentSet, currentIndex) =>
          currentIndex === index ? set : currentSet,
        ) || [],
    }));
  }, []);

  return (
    <SessionDataContext.Provider
      value={{
        activeRoutine,
        addToRoutine,
        getPlannedSets,
        hasActiveRoutine: !!activeRoutine,
        startRoutine,
        updatePlanedSets,
        updatePlanedSet,
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
