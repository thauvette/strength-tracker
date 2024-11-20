import { useState, createContext, useContext, useMemo } from 'preact/compat';
import dayjs from 'dayjs';

import { getFromCursor, getItem } from './utils/dbUtils';
import initializeDb from './initializeDb.js';
import {
  getWendlerExercises,
  updateWendlerItem,
  getWendlerCycle,
  createCycle,
} from './wendler.js';
import {
  createBioMetric,
  getAllBioById,
  getBioEntriesByDateRange,
} from './bioMetrics';
import { createEntry, deleteEntry, updateEntry } from './entries';
import {
  createOrUpdateLoggedSet,
  deleteLoggedSet,
  getDataAndAugmentSet,
  getSetsByDateRange,
} from './sets';
import {
  createRoutine,
  duplicateRoutine,
  getRoutine,
  getRoutines,
  updateRoutine,
  updateSingleRoutineSet,
} from './routines';
import {
  getAugmentedExercise,
  getExerciseHistoryById,
  getExerciseOptions,
} from './exercises';
import { getMuscleGroups } from './muscles';
import { createBackup, restoreFromBackup } from './sync';
import { objectStores } from './config';
import { DbStoredSet, Exercise, IDBContext, Routine, Set } from './types';
import useOnMount from '../../hooks/useOnMount';
import { RoutineSet } from '../../types/types';

const DBContext = createContext<IDBContext>(null);

export const DBProvider = ({ children }) => {
  const [db, setDb] = useState<IDBDatabase | null>();
  // INITIALIZE OUR DB
  useOnMount(() => {
    initializeDb(setDb);
  });

  const memoizedValue = useMemo(
    () => ({
      isInitialized: !!db,
      // WENDLER
      getWendlerCycle: (id: string) => getWendlerCycle(db, id),
      getWendlerExercises: () => getWendlerExercises(db),
      createCycle: (data: unknown) => createCycle(db, data),
      updateWendlerItem: ({ id, path, value }) =>
        updateWendlerItem(db, { id, path, value }),
      // SETS
      createOrUpdateLoggedSet: (id: number, data: Set) =>
        createOrUpdateLoggedSet(db, id, data),
      deleteLoggedSet: (id: number) => deleteLoggedSet(db, id),
      getTodaySets: () => {
        const today = dayjs().toDate();
        return getSetsByDateRange(db, today, today);
      },
      getSetsByDay: (date: Date) => getSetsByDateRange(db, date, date),
      getSetsByDateRange: (start: Date, end: Date) =>
        getSetsByDateRange(db, start, end),
      getDataAndAugmentSet: (set: DbStoredSet) => getDataAndAugmentSet(db, set),
      // EXERCISES
      getExerciseOptions: () => getExerciseOptions(db),
      getExerciseHistoryById: (id: number) => getExerciseHistoryById(db, id),
      getExercise: (id: number) =>
        getItem<Exercise>(db, objectStores.exercises, id),
      getAugmentedExercise: (id: number) => getAugmentedExercise(db, id),
      // SYNC
      createBackup: () => createBackup(db),
      restoreFromBackup: (entries: {
        stores: string[];
        items: { store: string; data: unknown; id: number }[];
      }) => restoreFromBackup(db, entries),
      // BIO METRICS
      createBioMetric: (name: string) => createBioMetric(db, name),
      getAllBioById: (id: number) => getAllBioById(db, id),
      getBioEntriesByDateRange: (startDate: string, endDate: string) =>
        getBioEntriesByDateRange(db, startDate, endDate),
      // MUSCLES
      getMuscleGroups: () => getMuscleGroups(db),
      // ROUTINES
      getRoutines: () => getRoutines(db),
      getRoutine: (id: number) => getRoutine(db, id),
      createRoutine: (data: Routine) => createRoutine(db, data),
      updateRoutine: (id: number, data: Partial<Routine>) =>
        updateRoutine(db, id, data),
      updateSingleRoutineSet: (id: number, dayId: string, set: RoutineSet) =>
        updateSingleRoutineSet(db, id, dayId, set),
      duplicateRoutine: (id: number) => duplicateRoutine(db, id),
      // GENERIC + ENTRIES
      getItem: (store: string, id: number) => getItem(db, store, id),
      getAllEntries: <Type,>(store: string) => getFromCursor<Type>(db, store),
      deleteEntry: (store: string, id: number) => deleteEntry(db, store, id),
      createEntry: (store: string, data: unknown) =>
        createEntry(db, store, data),
      updateEntry: (store: string, id: number, data: unknown) =>
        updateEntry(db, store, id, data),
    }),
    [db],
  );

  return (
    <DBContext.Provider value={memoizedValue}>{children}</DBContext.Provider>
  );
};

export default function useDB() {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDB must be inside DBContextProvider');
  }
  return context;
}
